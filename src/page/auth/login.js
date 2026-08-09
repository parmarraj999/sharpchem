import React, { useEffect, useState } from 'react';
import './login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleLoginButton from '../../function/googleSignUp';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import {
  emailPasswordLogin,
  getSignInMethodsForEmail,
  sendPasswordReset,
  resendVerificationWithPassword,
  isUserEmailVerified,
} from '../../firebase/authFunctions';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetInfo, setResetInfo] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const redirectTo = location.state?.from?.pathname || '/';

  useEffect(() => {
    const presetEmail = location.state?.email;
    if (presetEmail) {
      setFormData((prev) => ({ ...prev, email: presetEmail }));
    }
    if (location.state?.needVerification) {
      setNeedsVerification(true);
      setErrors({
        password:
          "Please verify your email before accessing SharpChem. Check your inbox, or resend the link below.",
      });
    }
  }, [location.state?.email, location.state?.needVerification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    setLoading(true);
    setMessage("");
    setNeedsVerification(false);
    setResetInfo("");

    const response = await emailPasswordLogin(formData.email, formData.password);

    if (response.success) {
      setErrors({});
      setMessage("Login successful!");
      setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
    } else {
      let errorMsg = "Wrong email or password.";
      let field = "password";

      switch (response.errorCode) {
        case "auth/email-not-verified":
          errorMsg = response.error;
          field = "password";
          setNeedsVerification(true);
          break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-login-credentials": {
          const methods = await getSignInMethodsForEmail(formData.email);
          if (methods.includes("google.com") && !methods.includes("password")) {
            errorMsg =
              "This email uses Google sign-in (no password yet). Use Continue with Google, or tap Forgot Password to set one so both methods work.";
          } else if (methods.includes("google.com") && methods.includes("password")) {
            errorMsg = "Wrong password. Or sign in with Google for this email.";
          } else {
            errorMsg = "Wrong email or password.";
          }
          field = "password";
          break;
        }

        case "auth/invalid-email":
          errorMsg = "Invalid email format.";
          field = "email";
          break;

        case "auth/too-many-requests":
          errorMsg = "Too many failed attempts. Please try again later.";
          field = "password";
          break;

        case "auth/network-request-failed":
          errorMsg = "Network error. Check your connection and try again.";
          field = "password";
          break;

        case "auth/user-disabled":
          errorMsg = "This account has been disabled.";
          field = "email";
          break;

        default:
          errorMsg = "Wrong email or password.";
          field = "password";
      }

      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }

    setLoading(false);
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setResetInfo("");
    if (!formData.email.trim() || !formData.password) {
      setErrors({
        password: "Enter the email and password you signed up with, then resend.",
      });
      return;
    }
    setLoading(true);
    const result = await resendVerificationWithPassword(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      setNeedsVerification(true);
      setResetInfo("Verification email sent again. Check your inbox (and spam), then sign in.");
      setErrors({});
    } else if (result.errorCode === "already-verified") {
      setNeedsVerification(false);
      setResetInfo(result.error);
      setErrors({});
    } else {
      setErrors({
        password: result.errorCode?.includes("credential") || result.errorCode === "auth/wrong-password"
          ? "Wrong email or password — can't resend without the correct password."
          : (result.error || "Could not resend verification email."),
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetInfo("");
    setErrors({});
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Enter your email above, then tap Forgot Password." });
      return;
    }
    setLoading(true);
    const result = await sendPasswordReset(formData.email);
    setLoading(false);
    if (result.success) {
      setResetInfo(
        "Password reset email sent. After you set a new password, you can use email/password and Google on the same account (if Google is linked)."
      );
    } else {
      setErrors({
        email: result.errorCode === "auth/user-not-found"
          ? "No account found with this email."
          : (result.error || "Could not send reset email."),
      });
    }
  };

  useEffect(() => {
    if (currentUser && isUserEmailVerified(currentUser)) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, navigate, redirectTo]);

  return (
    <div className="login-container">
      
      <div className='back-btn' onClick={()=>navigate('/')}>
          <ChevronLeft size={25}/>
      </div>

      <div className="login-wrapper">

        <div className="login-illustration">
          <div className="molecule-icon">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="15" fill="#1e88e5" opacity="0.8"/>
              <circle cx="150" cy="50" r="15" fill="#1e88e5" opacity="0.8"/>
              <circle cx="100" cy="130" r="15" fill="#1e88e5" opacity="0.8"/>
              <line x1="50" y1="50" x2="150" y2="50" stroke="#1e88e5" strokeWidth="3"/>
              <line x1="50" y1="50" x2="100" y2="130" stroke="#1e88e5" strokeWidth="3"/>
              <line x1="150" y1="50" x2="100" y2="130" stroke="#1e88e5" strokeWidth="3"/>
            </svg>
          </div>
          <h2>Master Chemistry Concepts</h2>
          <p>Your journey to chemistry excellence continues here</p>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h1 className="login-logo">SharpChem.in</h1>
            <p className="login-subtitle">Welcome back! Login to continue learning.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              {message && <span className="success-message">{message}</span>}
            </div>

            <div className="forgot-password">
              <a href="#forgot" onClick={handleForgotPassword}>Forgot Password?</a>
            </div>
            {needsVerification && (
              <div className="forgot-password">
                <a href="#resend-verify" onClick={handleResendVerification}>
                  Resend verification email
                </a>
              </div>
            )}
            {resetInfo && <span className="success-message">{resetInfo}</span>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <GoogleLoginButton />

            <div className="login-footer">
              <p>Don't have an account? <Link to='/signup' className="signup-link">Sign up</Link></p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
