/**
 * Shared syllabus tracks.
 * Public URLs (no underscores): /class/:id/:examType/...
 * - Board:  /class/9/standard/...  → Firestore class_9
 * - Comp:   /class/11/jee/...      → Firestore 11_jee
 * Firestore document ids stay underscore-based; only URL segments are clean.
 */

export const PRACTICE_TRACKS = {
  board: [
    {
      id: '9',
      examType: 'standard',
      firestoreId: 'class_9',
      label: 'Class 9',
      blurb: 'Board practice questions & quizzes',
      learnBlurb: 'Foundation concepts, video lessons & notes',
    },
    {
      id: '10',
      examType: 'standard',
      firestoreId: 'class_10',
      label: 'Class 10',
      blurb: 'Board practice questions & quizzes',
      learnBlurb: 'Board-focused lessons with video & notes',
    },
    {
      id: '11',
      examType: 'standard',
      firestoreId: 'class_11',
      label: 'Class 11',
      blurb: 'Board practice questions & quizzes',
      learnBlurb: 'Senior secondary concepts, video & notes',
    },
    {
      id: '12',
      examType: 'standard',
      firestoreId: 'class_12',
      label: 'Class 12',
      blurb: 'Board practice questions & quizzes',
      learnBlurb: 'Board mastery with topic lessons & notes',
    },
  ],
  competitive: [
    {
      id: '11',
      examType: 'jee',
      firestoreId: '11_jee',
      label: 'Class 11 JEE',
      blurb: 'JEE Main & Advanced drills',
      learnBlurb: 'JEE-oriented chapter lessons & notes',
    },
    {
      id: '11',
      examType: 'neet',
      firestoreId: '11_neet',
      label: 'Class 11 NEET',
      blurb: 'NEET medical entrance drills',
      learnBlurb: 'NEET-oriented chapter lessons & notes',
    },
    {
      id: '12',
      examType: 'jee',
      firestoreId: '12_jee',
      label: 'Class 12 JEE',
      blurb: 'JEE finals problem practice',
      learnBlurb: 'JEE finals chapter lessons & notes',
    },
    {
      id: '12',
      examType: 'neet',
      firestoreId: '12_neet',
      label: 'Class 12 NEET',
      blurb: 'NEET finals problem practice',
      learnBlurb: 'NEET finals chapter lessons & notes',
    },
  ],
};

const VALID_EXAM_TYPES = new Set(['standard', 'jee', 'neet']);

/** Flat list of all tracks (board then competitive) */
export function allSyllabusTracks() {
  return [...PRACTICE_TRACKS.board, ...PRACTICE_TRACKS.competitive];
}

/** Route params → Firestore class_data document id */
export function resolvePracticeClassId(id, examType) {
  if (!id || !examType) return null;
  const type = String(examType).toLowerCase();
  if (!VALID_EXAM_TYPES.has(type)) return null;
  if (type === 'standard') return `class_${id}`;
  return `${id}_${type}`;
}

/**
 * Firestore class id → { id, examType } for clean URLs
 * class_9 → { id: '9', examType: 'standard' }
 * 11_jee → { id: '11', examType: 'jee' }
 */
export function parseFirestoreClassId(firestoreId) {
  if (!firestoreId) return null;
  if (firestoreId.startsWith('class_')) {
    return { id: firestoreId.replace('class_', ''), examType: 'standard' };
  }
  const match = String(firestoreId).match(/^(\d+)_(jee|neet)$/i);
  if (match) {
    return { id: match[1], examType: match[2].toLowerCase() };
  }
  return null;
}

/** Human-readable label for practice headers */
export function practiceTrackLabel(id, examType) {
  if (!id || !examType) return 'Practice';
  const type = String(examType).toLowerCase();
  if (type === 'standard') return `Class ${id} – Board`;
  return `Class ${id} – ${type.toUpperCase()}`;
}

/** Practice chapter list */
export function practiceChapterListPath(id, examType) {
  return `/class/${id}/${examType}/chapterList`;
}

/** Learn: chapter list for a track (or firestore id) */
export function academicsClassPath(trackOrFirestoreId) {
  if (!trackOrFirestoreId) return '/academic';
  if (typeof trackOrFirestoreId === 'object' && trackOrFirestoreId.id && trackOrFirestoreId.examType) {
    return `/class/${trackOrFirestoreId.id}/${trackOrFirestoreId.examType}`;
  }
  const parsed = parseFirestoreClassId(trackOrFirestoreId);
  if (!parsed) return '/academic';
  return `/class/${parsed.id}/${parsed.examType}`;
}

/** Learn: chapter detail */
export function academicsChapterPath(id, examType, chapterId) {
  if (!id || !examType || !chapterId) return '/academic';
  return `/class/${id}/${examType}/chapter/${chapterId}`;
}

/** Learn: topic lesson */
export function academicsLessonPath(id, examType, chapterId, topicId) {
  if (!id || !examType || !chapterId || !topicId) return '/academic';
  return `/class/${id}/${examType}/chapter/${chapterId}/learn/${topicId}`;
}

/**
 * Firestore class id + chapter → practice topics path
 * class_9 → /class/9/standard/chapter/{chapterId}/topics
 */
export function practiceTopicsPathFromFirestore(firestoreClassId, chapterId) {
  if (!firestoreClassId || !chapterId) return null;
  const parsed = parseFirestoreClassId(firestoreClassId);
  if (!parsed) return null;
  return `/class/${parsed.id}/${parsed.examType}/chapter/${chapterId}/topics`;
}

/** Whether pathname is a practice (drill) route under /class/... */
export function isPracticeClassPath(pathname) {
  if (!pathname) return false;
  if (/\/class\/[^/]+\/(standard|jee|neet)\/chapterList(\/|$)/i.test(pathname)) return true;
  if (/\/class\/[^/]+\/(standard|jee|neet)\/quizzes(\/|$)/i.test(pathname)) return true;
  if (/\/class\/[^/]+\/(standard|jee|neet)\/chapter\/[^/]+\/topics(\/|$)/i.test(pathname)) return true;
  if (/\/class\/[^/]+\/(standard|jee|neet)\/chapter\/[^/]+\/topic\//i.test(pathname)) return true;
  return false;
}

/** Whether pathname is a learn (academics) route under /class/... */
export function isAcademicsClassPath(pathname) {
  if (!pathname || isPracticeClassPath(pathname)) return false;
  return /^\/class\/[^/]+\/(standard|jee|neet)(\/|$)/i.test(pathname);
}
