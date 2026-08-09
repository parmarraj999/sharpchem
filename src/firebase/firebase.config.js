import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing ${key}. Copy .env.example to .env and fill Firebase web config, then restart npm start.`
    );
  }
  return value;
};

const firebaseConfig = {
  apiKey: required("REACT_APP_FIREBASE_API_KEY"),
  authDomain: required("REACT_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: required("REACT_APP_FIREBASE_PROJECT_ID"),
  storageBucket: required("REACT_APP_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: required("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: required("REACT_APP_FIREBASE_APP_ID"),
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const googleProvider = new GoogleAuthProvider();

export { auth, storage, db, googleProvider };
