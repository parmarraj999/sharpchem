import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export const QUIZ_ATTEMPTS_COLLECTION = 'quiz_attempts';

/**
 * Persist a finished quiz attempt for analytics.
 * @returns {Promise<string|null>} attempt doc id
 */
export async function saveQuizAttempt({
  uid,
  displayName,
  email,
  quizId,
  quizTitle,
  classId,
  chapterId,
  topicId,
  examType,
  score,
  total,
  answers,
  durationSec,
  timeLimitSec,
  status = 'completed',
}) {
  if (!uid || !quizId || !total) return null;

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const ref = await addDoc(collection(db, QUIZ_ATTEMPTS_COLLECTION), {
    uid,
    displayName: displayName || '',
    email: email || '',
    quizId,
    quizTitle: quizTitle || '',
    classId: classId || '',
    chapterId: chapterId || '',
    topicId: topicId || '',
    examType: examType || '',
    score,
    total,
    percent,
    answers: answers || {},
    durationSec: durationSec ?? null,
    timeLimitSec: timeLimitSec ?? null,
    status,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

/**
 * Latest attempt per quizId for this user within a topic (or overall).
 * Returns map: { [quizId]: attempt }
 */
export async function fetchLatestAttemptsByQuizIds(uid, quizIds) {
  if (!uid || !quizIds?.length) return {};

  const idSet = new Set(quizIds);
  const q = query(
    collection(db, QUIZ_ATTEMPTS_COLLECTION),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  try {
    const snap = await getDocs(q);
    const latest = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      if (!idSet.has(data.quizId) || latest[data.quizId]) return;
      latest[data.quizId] = { id: d.id, ...data };
    });
    return latest;
  } catch (error) {
    // Missing composite index or empty — fail soft
    console.warn('Could not load quiz attempt history:', error);
    return {};
  }
}

/** Recent attempts for one user (profile / dashboard). Also matches email if UID changed. */
export async function fetchAttemptsForUser(uid, { email, max = 50 } = {}) {
  if (!uid && !email) return [];

  const emailNorm = (email || '').trim().toLowerCase();
  const byId = new Map();

  const add = (rows) => {
    rows.forEach((row) => {
      if (!byId.has(row.id)) byId.set(row.id, row);
    });
  };

  if (uid) {
    try {
      const q = query(
        collection(db, QUIZ_ATTEMPTS_COLLECTION),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(max)
      );
      const snap = await getDocs(q);
      add(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.warn('Could not load quiz attempts by uid:', error);
    }
  }

  // Fallback / email match when Auth UID changed (e.g. Google linking)
  // Must use constrained queries — rules deny listing all attempts as a student.
  if (emailNorm) {
    try {
      const q = query(
        collection(db, QUIZ_ATTEMPTS_COLLECTION),
        where('email', '==', email.trim()),
        orderBy('createdAt', 'desc'),
        limit(max)
      );
      const snap = await getDocs(q);
      add(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.warn('Could not load quiz attempts by email:', error);
      try {
        const q = query(
          collection(db, QUIZ_ATTEMPTS_COLLECTION),
          where('email', '==', emailNorm),
          limit(max)
        );
        const snap = await getDocs(q);
        add(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err2) {
        console.warn('email fallback query failed:', err2);
      }
    }
  }

  const toMillis = (createdAt) => {
    if (!createdAt) return 0;
    if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
    if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
    const t = new Date(createdAt).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  return Array.from(byId.values())
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
    .slice(0, max);
}

/** Dashboard rollup from attempt docs. */
export function buildDashboardStats(attempts) {
  if (!attempts?.length) {
    return {
      quizzesAttempted: 0,
      questionsSolved: 0,
      accuracy: 0,
      studyTimeLabel: '0m',
      studyTimeSec: 0,
      uniqueQuizzes: 0,
    };
  }

  const uniqueQuizzes = new Set(attempts.map((a) => a.quizId).filter(Boolean)).size;
  const questionsSolved = attempts.reduce((s, a) => s + (Number(a.score) || 0), 0);
  const questionsTotal = attempts.reduce((s, a) => s + (Number(a.total) || 0), 0);
  const accuracy = questionsTotal > 0 ? Math.round((questionsSolved / questionsTotal) * 100) : 0;
  const studyTimeSec = attempts.reduce((s, a) => s + (Number(a.durationSec) || 0), 0);

  const hours = Math.floor(studyTimeSec / 3600);
  const mins = Math.floor((studyTimeSec % 3600) / 60);
  let studyTimeLabel = '0m';
  if (hours > 0) studyTimeLabel = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  else if (mins > 0) studyTimeLabel = `${mins}m`;
  else if (studyTimeSec > 0) studyTimeLabel = '<1m';

  return {
    quizzesAttempted: attempts.length,
    questionsSolved,
    accuracy,
    studyTimeLabel,
    studyTimeSec,
    uniqueQuizzes,
  };
}

/** Last 7 calendar days → avg % score per day (for chart). */
export function buildWeeklyPerformance(attempts) {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const dayKey = (date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const buckets = Object.fromEntries(days.map((d) => [dayKey(d), []]));

  attempts.forEach((a) => {
    if (!a.createdAt) return;
    const date =
      typeof a.createdAt.toDate === 'function'
        ? a.createdAt.toDate()
        : new Date(a.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = dayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    if (buckets[key]) buckets[key].push(a.percent ?? 0);
  });

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((d) => {
    const scores = buckets[dayKey(d)] || [];
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
        : 0;
    return {
      day: labels[d.getDay()],
      score: avg,
      attempts: scores.length,
    };
  });
}

export function summarizeAttempts(attempts) {
  if (!attempts?.length) {
    return { count: 0, avgPercent: 0, bestPercent: 0 };
  }
  const percents = attempts.map((a) => a.percent ?? 0);
  const sum = percents.reduce((s, n) => s + n, 0);
  return {
    count: attempts.length,
    avgPercent: Math.round(sum / attempts.length),
    bestPercent: Math.max(...percents),
  };
}
