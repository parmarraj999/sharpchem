import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../function/googleSignUp';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  School,
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import { emailPasswordSignup, signOutUser } from '../../firebase/authFunctions';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

const Signup = () => {
    const [formData, setFormData] = useState({
    salutation: 'Mr/ms',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    city: '',
    state: '',
    schoolName: '',
    currentClass: '',
    goal: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  const navigate = useNavigate();

  const stateOptions = [
    "Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Maharashtra",
    "Gujarat", "Rajasthan", "Delhi", "Uttar Pradesh", "Bihar", "West Bengal",
    "Madhya Pradesh", "Punjab", "Haryana", "Jharkhand", "Odisha", "Chhattisgarh",
    "Uttarakhand", "Himachal Pradesh", "Assam", "Goa", "Other",
  ];

  const classOptions = ["Class 9", "Class 10", "Class 11", "Class 12", "Droppers"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.contactNumber.length !== 10) newErrors.contactNumber = '10 digits required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.currentClass) newErrors.currentClass = 'Required';
    if (!formData.goal) newErrors.goal = 'Required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    setMessage("");

    const response = await emailPasswordSignup(formData.email, formData.password);

    if (response.success) {
      try {
        await setDoc(doc(db, "users", response.user.uid), {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          examType: formData.goal,
          role: 'student',
          createdAt: new Date()
        });
      } catch (profileErr) {
        console.warn("Could not save profile after signup:", profileErr);
      }
      // Firebase signs the user in on create — sign out until they verify
      await signOutUser();
      setAwaitingVerification(true);
    } else {
      setMessage(response.error || "Signup failed");
    }
    setLoading(false);
  };

  if (awaitingVerification) {
    return (
      <div className="modern-signup-container">
        <div className="glass-blob blob-1"></div>
        <div className="glass-blob blob-2"></div>

        <div className="verify-email-panel">
          <div className="verify-email-icon" aria-hidden>
            <Mail size={40} />
          </div>
          <h2>Verify your email</h2>
          <p>
            We sent a verification link to <strong>{formData.email}</strong>.
            Open your inbox, confirm the address, then sign in. You can&apos;t access the app until the email is verified.
          </p>
          <button
            type="button"
            className="modern-submit-btn"
            onClick={() => navigate('/login', { state: { email: formData.email } })}
          >
            Go to Sign in
          </button>
          <p className="verify-email-hint">
            Didn&apos;t get it? Check spam, or sign in later and use &ldquo;Resend verification&rdquo;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-signup-container">
      <div className="glass-blob blob-1"></div>
      <div className="glass-blob blob-2"></div>

      <button className="back-link" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back
      </button>

      <div className="modern-signup-card">
        <div className="modern-signup-left">
          <div className="brand-section">
            <h1 className="logo-text">Sharp<span>Chem</span></h1>
            <p className="logo-tagline">Master Chemistry with Interactive Learning</p>
          </div>
          <div className="illustration-wrapper">
            <div className="circle-glow"></div>
            <div className="floating-icons">
              {/* Decorative elements */}
            </div>
          </div>
        </div>

        <div className="modern-signup-right">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join our community of learners today</p>
          </div>

          <form className="modern-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className={`modern-input-group tiny ${errors.firstName || errors.lastName ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <select name="salutation" value={formData.salutation} onChange={handleChange}>
                    <option value="Mr/ms">Mr/Ms</option>
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                  </select>
                </div>
              </div>
              <div className={`modern-input-group flex-1 ${errors.firstName ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                </div>
              </div>
              <div className={`modern-input-group flex-1 ${errors.lastName ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className={`modern-input-group ${errors.email ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className={`modern-input-group ${errors.password ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className={`modern-input-group full ${errors.contactNumber ? 'error' : ''}`}>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, contactNumber: value });
                  }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className={`modern-input-group ${errors.city ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div className={`modern-input-group ${errors.state ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="modern-input-group flex-2">
                <div className="input-wrapper">
                  <School className="input-icon" size={18} />
                  <input type="text" name="schoolName" placeholder="School Name (Optional)" value={formData.schoolName} onChange={handleChange} />
                </div>
              </div>
              <div className={`modern-input-group flex-1 ${errors.currentClass ? 'error' : ''}`}>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" size={18} />
                  <select name="currentClass" value={formData.currentClass} onChange={handleChange}>
                    <option value="">Class</option>
                    {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className={`modern-input-group full ${errors.goal ? 'error' : ''}`}>
              <p className="signup-goal-label">Goal</p>
              <div className="signup-goal-row">
                {['JEE', 'NEET', 'Boards'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`signup-goal-btn ${formData.goal === g ? 'is-active' : ''}`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, goal: g }));
                      if (errors.goal) setErrors((prev) => ({ ...prev, goal: '' }));
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Sign Up Now"}
            </button>

            {message && <div className="form-message error">{message}</div>}

            <div className="form-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
              <div className="divider"><span>OR</span></div>
              <GoogleLoginButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
