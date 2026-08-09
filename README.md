# 🧪 SharpChem.in — Modern Chemistry Learning Platform

**SharpChem.in** is the student-facing React app for learning Chemistry — class-wise lessons (video & notes), practice questions, and quizzes — powered by Firebase project `sharpchem-aca68`.

Companion CMS: **sharpchem-admin**.

---

## 🚀 Features

* 🎓 **Class-wise content** — Board Classes 9–12 plus competitive **11/12 JEE & NEET**
* 📘 **Academics (Learn)** — Track → chapters → topics → **video lesson + notes**
* 🧾 **Practice (Drill)** — Same tracks → chapters → topics → **questions & timed quizzes**
* 🏠 **Home CTAs** — Per track: **Explore Chapters** (learn) and **Practice** (drill)
* 🧭 **Smart nav** — Academics vs Practice highlighting by route family
* 🔐 **Authentication** — Email/password & Google sign-in (Firebase Auth)
* 📱 **Responsive UI** — Desktop, tablet, and mobile
* 🔗 **Clean URLs** — `/class/9/standard` (learn) vs `/class/9/standard/chapterList` (practice); Firestore ids stay `class_9`, `11_jee`, etc.

---

## 🧩 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** (CRA) | Frontend framework |
| **React Router DOM** | Navigation |
| **Firebase Auth** | Login / signup |
| **Cloud Firestore** | Syllabus, questions, quizzes |
| **Lucide React** | Icons |
| **HTML5 / CSS3** | Layout & styling |
| **Google Fonts (Poppins)** | Typography |

---

## 📁 Folder Structure

```
sharpchem/
│
├── src/
│   ├── page/
│   │   ├── academic-page/      # Academics hub
│   │   ├── chapter-page/       # Learn chapter list
│   │   ├── chapter-detail/     # Chapter outline + topic lesson
│   │   ├── practice/           # Practice hub + drills
│   │   ├── home-page/
│   │   ├── auth/
│   │   └── details/
│   ├── components/             # Navbar, ProtectedRoute, popups
│   ├── context/                # AuthContext
│   ├── utils/practiceRoutes.js # URL ↔ Firestore mapping
│   ├── firebase/
│   ├── App.js
│   └── index.js
│
├── public/
├── ARCHITECTURE.md
├── README.md
└── package.json
```

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for data model, routing, and Learn vs Practice flows.

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sharpchem.git
   cd sharpchem
   ```

2. **Install dependencies & env**

   ```bash
   npm install
   cp .env.example .env
   # Fill REACT_APP_FIREBASE_* from Firebase Console → Project settings → Your apps
   ```

3. **Run the development server**

   ```bash
   npm start
   ```

   App: [http://localhost:3000](http://localhost:3000)

4. **Build for production**

   ```bash
   npm run build
   ```

Firebase config is loaded from `.env` (gitignored). Template: `.env.example` (same project as admin).

---

## 🗺️ URL cheat sheet

| Mode | Example |
|------|---------|
| Learn chapters | `/class/9/standard`, `/class/11/jee` |
| Topic lesson | `/class/11/jee/chapter/:chapterId/learn/:topicId` |
| Practice list | `/class/9/standard/chapterList` |
| Practice Qs | `/class/.../topic/:topicId/questions` |

---

## 🧠 Future / deferred

* Persist student-details form & quiz attempts
* Harden auth / security rules (shared with admin work)
* Fill marketing placeholders (`/blog`, `/about`, `/contact`)

---

## 🧑‍💻 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Open a pull request  

---

## 🪪 License

This project is licensed under the **MIT License** — free to use and modify with attribution.

---

## ✉️ Contact

**Developer:** Harshit Parmar  
📧 [developersucks@gmail.com](mailto:developersucks@gmail.com)  
🌐 SharpChem.in

---

**"Learn Chemistry the Smart Way — with SharpChem.in"**
