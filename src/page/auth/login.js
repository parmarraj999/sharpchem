import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../function/googleSignUp';
import { ChevronLeft } from 'lucide-react';
import { emailPasswordLogin } from '../../firebase/authFunctions';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

    const response = await emailPasswordLogin(formData.email, formData.password);

    if (response.success) {
      setMessage("Login successful!");
      window.localStorage.setItem('userId',response.user.uid)
      window.localStorage.setItem('isLogIn',true) 
      setTimeout(() => navigate("/"), 1000);
    } else {
      let errorMsg = response.error;

      // Firebase-specific error handling
      switch (response.errorCode) {
        case "auth/user-not-found":
          errorMsg = "No account found with this email.";
          setErrors(prev => ({ ...prev, email: errorMsg }));
          break;

        case "auth/wrong-password":
          errorMsg = "Incorrect password. Try again.";
          setErrors(prev => ({ ...prev, password: errorMsg }));
          break;

        case "auth/invalid-email":
          errorMsg = "Invalid email format.";
          setErrors(prev => ({ ...prev, email: errorMsg }));
          break;

        default:
          errorMsg = "Login failed. Please try again.";
      }

      setMessage(errorMsg);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      
      <div className='back-btn' onClick={()=>navigate(-1)}>
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

          {message && <p className="server-message" style={{color:'red'}}>{message}</p>}

          <form className="login-form">

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
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn" onClick={handleSubmit}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <GoogleLoginButton/>

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
