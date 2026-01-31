// authFunctions.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";

export const emailPasswordSignup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const emailPasswordLogin = async (email, password) => {


  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      errorCode: error.code
    };
  }
};