// authFunctions.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  linkWithCredential,
  linkWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.config";

/** Google (and other OAuth) emails are treated as verified by Firebase. */
export const isUserEmailVerified = (user) => {
  if (!user) return false;
  if (user.emailVerified) return true;
  return Boolean(user.providerData?.some((p) => p.providerId === "google.com"));
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const resendVerificationEmail = async (user = auth.currentUser) => {
  if (!user) {
    return { success: false, error: "Not signed in", errorCode: "no-user" };
  }
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

/** Sign in briefly to resend verification, then sign out again. */
export const resendVerificationWithPassword = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (isUserEmailVerified(cred.user)) {
      await signOut(auth);
      return { success: false, errorCode: "already-verified", error: "This email is already verified. You can sign in." };
    }
    await sendEmailVerification(cred.user);
    await signOut(auth);
    return { success: true };
  } catch (error) {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const emailPasswordSignup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Verified emails are protected from Google sign-in overwriting the password account
    try {
      await sendEmailVerification(userCredential.user);
    } catch (verifyErr) {
      console.warn("Could not send verification email:", verifyErr);
    }
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const emailPasswordLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Fresh token so emailVerified is up to date after they clicked the link
    try {
      await userCredential.user.reload();
    } catch {
      /* ignore */
    }
    const user = auth.currentUser || userCredential.user;

    if (!isUserEmailVerified(user)) {
      try {
        await signOut(auth);
      } catch {
        /* ignore */
      }
      return {
        success: false,
        errorCode: "auth/email-not-verified",
        error: "Please verify your email before signing in. Check your inbox for the link.",
        email: user.email || email,
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
};

/**
 * Returns sign-in provider ids for an email, e.g. ['google.com'] or ['password'].
 * May return [] when Firebase email-enumeration protection is enabled.
 */
export const getSignInMethodsForEmail = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email.trim());
    return methods || [];
  } catch (error) {
    console.warn("fetchSignInMethodsForEmail failed:", error);
    return [];
  }
};

/** Link Google to the currently signed-in (e.g. password) user. */
export const linkGoogleToCurrentUser = async () => {
  if (!auth.currentUser) {
    return { success: false, error: "Not signed in", errorCode: "no-user" };
  }
  try {
    const result = await linkWithPopup(auth.currentUser, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

/**
 * After password login, attach a pending Google credential
 * (from auth/account-exists-with-different-credential).
 */
export const linkPendingGoogleCredential = async (credential) => {
  if (!auth.currentUser || !credential) {
    return { success: false, error: "Missing user or credential", errorCode: "invalid" };
  }
  try {
    const result = await linkWithCredential(auth.currentUser, credential);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const credentialFromGoogleError = (error) => {
  try {
    return GoogleAuthProvider.credentialFromError(error);
  } catch {
    return null;
  }
};

/** Lets Google-only users add a password via email reset link. */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, errorCode: error.code };
  }
};

export const userHasPasswordProvider = (user) =>
  Boolean(user?.providerData?.some((p) => p.providerId === "password"));

export const userHasGoogleProvider = (user) =>
  Boolean(user?.providerData?.some((p) => p.providerId === "google.com"));
