import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {

    const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("User Details:", user);
      window.localStorage.setItem("userId",user.uid);
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        createdAt: new Date()
      })
      .then(()=>{
        navigate("/");
      })
      .catch(()=>{
        alert("Something went wrong, Try again later!")
      })

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button
      onClick={googleLogin}
      style={{
        padding: "10px",
        borderRadius: "10px",
        background: "#ffffffff",
        color: "#000",
        border: "1px solid grey",
        fontSize: "16px",
        display:'flex',
        alignItems:'center',
        gap:'10px',
        justifyContent:'center',
        cursor: "pointer"
      }}
    >
    <img src="https://i.pinimg.com/736x/45/20/dd/4520ddfc56208707045c56232e946f7f.jpg" style={{width:'30px',height:'30px'}} />
      Google
    </button>
  );
};

export default GoogleLoginButton;
