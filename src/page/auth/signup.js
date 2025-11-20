import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../function/googleSignUp';
import { ChevronLeft } from 'lucide-react';
import { emailPasswordSignup } from '../../firebase/authFunctions';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Input Change
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

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = async (e) => {
     e.preventDefault();
  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    return setErrors(newErrors);
  }

  setLoading(true);
  setMessage("");

  const response = await emailPasswordSignup(formData.email, formData.password);

  if (response.success) {
    setMessage("Signup successful!");
    setTimeout(() => navigate("/"), 1000);
  } 
  else {
    let errorMsg = response.error;

    // Firebase Error Handling
    switch (response.errorCode) {
      case "auth/email-already-in-use":
        errorMsg = "Email already registered. Try logging in.";
        setErrors(prev => ({ ...prev, email: errorMsg }));
        break;

      case "auth/weak-password":
        errorMsg = "Password must be at least 8 characters.";
        setErrors(prev => ({ ...prev, password: errorMsg }));
        break;

      case "auth/invalid-email":
        errorMsg = "Invalid email format.";
        setErrors(prev => ({ ...prev, email: errorMsg }));
        break;

      default:
        errorMsg = response.error || "Signup failed. Try again.";
    }

    setMessage(errorMsg);
  }

  setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className='back-btn' onClick={() => navigate(-1)}>
        <ChevronLeft size={25} />
      </div>

      <div className="signup-wrapper">
        
        {/* LEFT SIDE ILLUSTRATION */}
        <div className="signup-illustration">
          <div className="flask-icon">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M 80 40 L 80 80 L 40 160 Q 40 180 60 180 L 140 180 Q 160 180 160 160 L 120 80 L 120 40 Z"
                fill="#1e88e5" opacity="0.8" stroke="#0d47a1" strokeWidth="3" />
              <ellipse cx="100" cy="40" rx="20" ry="8" fill="#1e88e5" opacity="0.9" />
              <circle cx="70" cy="130" r="8" fill="#ffffff" opacity="0.6" />
              <circle cx="100" cy="145" r="6" fill="#ffffff" opacity="0.6" />
              <circle cx="125" cy="135" r="7" fill="#ffffff" opacity="0.6" />
            </svg>
          </div>
          <h2>Begin Your Chemistry Journey</h2>
          <p>Join thousands of students mastering chemistry with interactive lessons and expert guidance</p>
        </div>

        {/* RIGHT SIDE SIGNUP CARD */}
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-logo">SharpChem.in</h1>
            <p className="signup-subtitle">Create your free Chemistry learning account.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {/* Signup Button */}
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* GOOGLE SIGNUP */}
            <GoogleLoginButton />

            {/* Message */}
            {message && <p className="signup-message">{message}</p>}

            <div className="signup-footer">
              <p>Already have an account? <Link to='/login' className="login-link">Login</Link></p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;
