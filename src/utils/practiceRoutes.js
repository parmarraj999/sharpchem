/**
 * Practice URLs use /class/:id/:examType/...
 * - Board tracks: /class/9/standard/... → Firestore class_9
 * - Competitive:  /class/11/jee/...     → Firestore 11_jee
 */

export const PRACTICE_TRACKS = {
  board: [
    { id: '9', examType: 'standard', firestoreId: 'class_9', label: 'Class 9', blurb: 'Board practice questions & quizzes' },
    { id: '10', examType: 'standard', firestoreId: 'class_10', label: 'Class 10', blurb: 'Board practice questions & quizzes' },
    { id: '11', examType: 'standard', firestoreId: 'class_11', label: 'Class 11', blurb: 'Board practice questions & quizzes' },
    { id: '12', examType: 'standard', firestoreId: 'class_12', label: 'Class 12', blurb: 'Board practice questions & quizzes' },
  ],
  competitive: [
    { id: '11', examType: 'jee', firestoreId: '11_jee', label: 'Class 11 JEE', blurb: 'JEE Main & Advanced drills' },
    { id: '11', examType: 'neet', firestoreId: '11_neet', label: 'Class 11 NEET', blurb: 'NEET medical entrance drills' },
    { id: '12', examType: 'jee', firestoreId: '12_jee', label: 'Class 12 JEE', blurb: 'JEE finals problem practice' },
    { id: '12', examType: 'neet', firestoreId: '12_neet', label: 'Class 12 NEET', blurb: 'NEET finals problem practice' },
  ],
};

/** Route params → Firestore class_data document id */
export function resolvePracticeClassId(id, examType) {
  if (!id || !examType) return null;
  const type = examType.toLowerCase();
  if (type === 'standard') return `class_${id}`;
  return `${id}_${type}`;
}

/** Human-readable label for practice headers */
export function practiceTrackLabel(id, examType) {
  if (!id || !examType) return 'Practice';
  const type = examType.toLowerCase();
  if (type === 'standard') return `Class ${id} – Board`;
  return `Class ${id} – ${type.toUpperCase()}`;
}

/** Chapter list path for a track */
export function practiceChapterListPath(id, examType) {
  return `/class/${id}/${examType}/chapterList`;
}

/**
 * Firestore class id + chapter → topics (practice) path
 * class_9 → /class/9/standard/chapter/{chapterId}/topics
 * 11_jee → /class/11/jee/chapter/{chapterId}/topics
 */
export function practiceTopicsPathFromFirestore(firestoreClassId, chapterId) {
  if (!firestoreClassId || !chapterId) return null;

  if (firestoreClassId.startsWith('class_')) {
    const num = firestoreClassId.replace('class_', '');
    return `/class/${num}/standard/chapter/${chapterId}/topics`;
  }

  const match = firestoreClassId.match(/^(\d+)_(jee|neet)$/i);
  if (match) {
    return `/class/${match[1]}/${match[2].toLowerCase()}/chapter/${chapterId}/topics`;
  }

  return null;
}
