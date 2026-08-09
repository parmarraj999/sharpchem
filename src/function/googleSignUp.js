import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import {
  emailPasswordLogin,
  linkPendingGoogleCredential,
  linkGoogleToCurrentUser,
  credentialFromGoogleError,
} from "../firebase/authFunctions";

const upsertUserProfile = async (user) => {
  const userRef = doc(db, "users", user.uid);
  let isNewUser = false;
  try {
    const existing = await getDoc(userRef);
    isNewUser = !existing.exists();
    await setDoc(
      userRef,
      {
        name: user.displayName || existing.data()?.name || "",
        email: user.email || existing.data()?.email || "",
        ...(isNewUser ? { createdAt: new Date() } : {}),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (profileErr) {
    console.warn("Could not upsert user profile after Google sign-in:", profileErr);
  }
  return isNewUser;
};

/**
 * Google sign-in that keeps one account per email:
 * - If already logged in with password → link Google to that account
 * - If Google hits an existing password account → ask for password, then link
 * - Otherwise normal Google sign-in
 */
const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Link flow when Google email already has a password account
  const [linkFlow, setLinkFlow] = useState(null); // { email, credential }
  const [linkPassword, setLinkPassword] = useState("");

  const redirectAfterAuth = location.state?.from?.pathname || "/";

  const finishSignedIn = async (user, { linked = false } = {}) => {
    const isNewUser = await upsertUserProfile(user);
    if (linked) {
      setInfo("Google is now linked. You can sign in with email/password or Google.");
    }
    if (isNewUser && !linked) {
      navigate("/student-detail");
    } else {
      navigate(redirectAfterAuth, { replace: true });
    }
  };

  const googleLogin = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      // Already signed in (e.g. password) → link Google instead of switching accounts
      if (auth.currentUser) {
        const hasGoogle = auth.currentUser.providerData.some(
          (p) => p.providerId === "google.com"
        );
        if (hasGoogle) {
          setInfo("Google is already linked to this account.");
          setLoading(false);
          return;
        }
        const linkResult = await linkGoogleToCurrentUser();
        if (!linkResult.success) {
          if (linkResult.errorCode === "auth/credential-already-in-use") {
            setError(
              "This Google account is already used by another SharpChem user. Sign out and use Google on that account, or use a different Google account."
            );
          } else {
            setError(linkResult.error || "Could not link Google to your account.");
          }
          setLoading(false);
          return;
        }
        await finishSignedIn(linkResult.user, { linked: true });
        setLoading(false);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      await finishSignedIn(result.user);
    } catch (err) {
      console.error("Google Login Error:", err);
      const code = err?.code || "";

      if (code === "auth/account-exists-with-different-credential") {
        const email = err?.customData?.email || "";
        const credential = credentialFromGoogleError(err);
        if (email && credential) {
          setLinkFlow({ email, credential });
          setInfo(
            "An account already exists with this email and a password. Enter that password to link Google — then both login methods will work."
          );
        } else {
          setError(
            "An account already exists with this email. Sign in with your password first, then use Continue with Google to link."
          );
        }
      } else if (code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (code === "auth/popup-blocked") {
        setError("Popup blocked. Allow popups for this site and try again.");
      } else if (code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for Google sign-in in Firebase.");
      } else if (code === "auth/credential-already-in-use") {
        setError("This Google account is already linked to another user.");
      } else {
        setError(err?.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmLinkWithPassword = async (e) => {
    e?.preventDefault?.();
    if (!linkFlow?.email || !linkPassword) {
      setError("Enter your account password to link Google.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const login = await emailPasswordLogin(linkFlow.email, linkPassword);
      if (!login.success) {
        setError("Wrong password for this email. Try again.");
        setLoading(false);
        return;
      }
      const linked = await linkPendingGoogleCredential(linkFlow.credential);
      if (!linked.success) {
        // Password login succeeded; Google may already be linked or conflict
        if (
          linked.errorCode === "auth/provider-already-linked" ||
          linked.errorCode === "auth/credential-already-in-use"
        ) {
          await finishSignedIn(auth.currentUser, { linked: true });
        } else {
          setError(linked.error || "Signed in, but could not link Google. Try Continue with Google again while logged in.");
          navigate(redirectAfterAuth, { replace: true });
        }
        setLoading(false);
        return;
      }
      setLinkFlow(null);
      setLinkPassword("");
      await finishSignedIn(linked.user, { linked: true });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Could not link Google account.");
    } finally {
      setLoading(false);
    }
  };

  const cancelLinkFlow = () => {
    setLinkFlow(null);
    setLinkPassword("");
    setInfo("");
    setError("");
  };

  if (linkFlow) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        {info ? (
          <span style={{ color: "#1565c0", fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
            {info}
          </span>
        ) : null}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#37474f" }}>
          Email
          <input
            type="email"
            value={linkFlow.email}
            readOnly
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              background: "#f5f5f5",
              boxSizing: "border-box",
            }}
          />
        </label>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#37474f" }}>
          Password
          <input
            type="password"
            value={linkPassword}
            onChange={(e) => setLinkPassword(e.target.value)}
            placeholder="Your SharpChem password"
            autoComplete="current-password"
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          />
        </label>
        <button
          type="button"
          onClick={confirmLinkWithPassword}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: 10,
            background: "#1e88e5",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Linking…" : "Link Google & continue"}
        </button>
        <button
          type="button"
          onClick={cancelLinkFlow}
          disabled={loading}
          style={{
            padding: "8px",
            borderRadius: 10,
            background: "transparent",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        {error ? (
          <span style={{ color: "#f44336", fontSize: 13, fontWeight: 500 }}>{error}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        type="button"
        onClick={googleLogin}
        disabled={loading}
        style={{
          padding: "10px",
          borderRadius: "10px",
          background: "#ffffffff",
          color: "#000",
          border: "1px solid grey",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          width: "100%",
        }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          width={20}
          height={20}
        />
        {loading
          ? "Signing in…"
          : auth.currentUser
            ? "Link Google to this account"
            : "Continue with Google"}
      </button>
      {info ? (
        <span style={{ color: "#1565c0", fontSize: 13, fontWeight: 500 }}>{info}</span>
      ) : null}
      {error ? (
        <span style={{ color: "#f44336", fontSize: 13, fontWeight: 500 }}>{error}</span>
      ) : null}
    </div>
  );
};

export default GoogleLoginButton;
