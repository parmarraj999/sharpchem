import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Login Form Data:', formData);
      alert('Login successful! Check console for data.');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
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

          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="login-btn">
              Login
            </button>

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