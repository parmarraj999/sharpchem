// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getStorage } from 'firebase/storage'
import  { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYXMRFe0bXqOHtgh8eIO6kSkQfhNeW2fk",
  authDomain: "sharpchem-aca68.firebaseapp.com",
  projectId: "sharpchem-aca68",
  storageBucket: "sharpchem-aca68.firebasestorage.app",
  messagingSenderId: "721925803442",
  appId: "1:721925803442:web:156f8497ac2f5f379468ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, storage, db, googleProvider};