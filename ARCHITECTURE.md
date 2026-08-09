# SharpChem Student — Architecture

This document describes how the **student** React app is structured, how it talks to Firebase, and how Learn vs Practice routes stay separate while sharing one curriculum tree.

---

## System context

```text
┌─────────────────┐         ┌──────────────────────┐
│  sharpchem      │         │  sharpchem-admin     │
│  (this repo)    │  read   │  (CMS)               │
│  Learn+Practice │◄────────┤  write syllabus / Qs  │
└────────┬────────┘         └──────────┬───────────┘
         │                             │
         │         Firebase            │
         │    project: sharpchem-aca68 │
         ▼                             ▼
   ┌─────────────────────────────────────────┐
   │  Auth · Firestore (class_data, quizzes) │
   │  Storage (notes / images — via admin)   │
   └─────────────────────────────────────────┘
```

Both apps share the same Firebase project. The student app is primarily a **reader** of `class_data` and `quizzes` (plus Auth for users).

---

## Product model

| Mode | Purpose | Leaf content |
|------|---------|--------------|
| **Academics (Learn)** | Study | Topic **video** + **notes** |
| **Practice (Drill)** | Test | Topic **questions** + **quizzes** |

Hierarchy (same for every track):

```text
Track (e.g. Class 9 board, Class 11 JEE)
  └── Chapter (name, description, order)
        └── Topic (name, description, order, videoUrl, noteUrl)
              ├── questions/     (practice)
              └── quizzes (top-level collection, filtered by class/chapter/topic)
```

Tracks (Firestore document ids under `class_data/`):

| Firestore id | Public URL prefix |
|--------------|-------------------|
| `class_9` … `class_12` | `/class/{9–12}/standard` |
| `11_jee`, `11_neet`, `12_jee`, `12_neet` | `/class/{11\|12}/{jee\|neet}` |

**Important:** Underscore ids stay in Firestore. Browser URLs use `id` + `examType` only. Conversion: `src/utils/practiceRoutes.js` (`resolvePracticeClassId`, `parseFirestoreClassId`, path builders).

---

## Routing

### Learn

```text
/academic
/class/:id/:examType                          → chapter list
/class/:id/:examType/chapter/:chapterId       → chapter outline + topics
/class/:id/:examType/chapter/:chapterId/learn/:topicId  → lesson
```

### Practice

```text
/practice
/class/:id/:examType/chapterList
/class/:id/:examType/chapter/:chapterId/topics
/class/:id/:examType/chapter/:chapterId/topic/:topicId/questions
/class/:id/:examType/chapter/:chapterId/topic/:topicId/quizzes
/class/:id/:examType/chapter/:chapterId/topic/:topicId/quiz/:quizId
```

Practice paths are distinguished from learn by suffixes (`chapterList`, `topics`, `topic/...`). Navbar active state uses `isPracticeClassPath` / `isAcademicsClassPath`.

Legacy paths (`/class/class_9`, `/class/:firestoreId/chapter/...`) **redirect** to the clean scheme.

### Other

- `/`, `/login`, `/signup`, `/profile/:id`, `/student-detail`
- Placeholders: `/blog`, `/about`, `/contact`

Most app routes wrap `ProtectedRoute` (requires Firebase Auth session).

---

## Frontend structure

```text
src/
├── App.js                 # Route table + legacy redirects
├── context/AuthContext.js
├── components/
│   ├── navbar/
│   ├── ProtectedRoute.js
│   └── …
├── page/
│   ├── academic-page/     # Track hub (board + competitive)
│   ├── chapter-page/      # Learn chapters for one track
│   ├── chapter-detail/    # Chapter + TopicLesson
│   ├── practice/          # Hub + chapter/topic/activity pages
│   ├── home-page/         # Marketing + dual CTAs per track
│   ├── auth/
│   └── details/
├── utils/practiceRoutes.js
└── firebase/
```

Pages resolve Firestore ids from route params, then call Firestore (`collection` / `doc` / `getDocs` / `getDoc`). No separate backend API.

---

## Data access patterns

### Syllabus

```text
class_data/{firestoreClassId}/chapters/{chapterId}
class_data/{firestoreClassId}/chapters/{chapterId}/topics/{topicId}
class_data/{firestoreClassId}/chapters/{chapterId}/topics/{topicId}/questions/{questionId}
```

Typical fields:

- Chapter: `name`, `description`, `order`, timestamps  
- Topic: `name`, `description`, `order`, `videoUrl`, `noteUrl`  
- Question: prompt, options, correct index/key, optional image URL  

### Quizzes

Top-level `quizzes` collection documents include `classId` (Firestore id), `chapterId`, `topicId`, `title`, `duration`, `examType`, etc. Student quiz list queries by those fields.

### Quiz attempts (analytics)

Top-level `quiz_attempts` — one doc per finished attempt (`uid`, quiz/track ids, score, answers, `createdAt`). Written on submit / timeout from `quizPage.js` via `utils/quizAttempts.js`. Admin reads them at `/admin/analytics`.

### Auth

`AuthContext` + Firebase Auth is the source of truth (`currentUser.uid`). Do **not** use `localStorage` `isLogIn` / `userId` flags.

---

## Key flows

### Learn a topic

1. Academics or Home → track (`/class/11/jee`)
2. Chapter list → chapter detail
3. Topic row → lesson page (video iframe + notes PDF/image)
4. Optional CTA → practice questions for same topic

### Practice a topic

1. Practice hub or Home **Practice** → `.../chapterList`
2. Chapter → topics → Questions or Quizzes
3. Questions page: tap option → immediate correctness feedback

---

## Cross-cutting utilities

| Module | Role |
|--------|------|
| `practiceRoutes.js` | Track catalog, URL builders, Firestore id mapping, nav path classifiers |
| `AuthContext` | Current user for protected routes |
| `firebase.config.js` | App init (shared project id with admin) |

---

## Non-goals / known gaps

- Admin CMS lives in **sharpchem-admin**, not this repo  
- Blog / About / Contact are placeholders  
- Security Rules and Storage uploads are owned mainly by admin + deferred auth work  
- Do not rename Firestore ids for “pretty URLs”; map in the client instead  

---

## Related

- [README.md](./README.md)
- Admin architecture: `../sharpchem-admin/ARCHITECTURE.md`
