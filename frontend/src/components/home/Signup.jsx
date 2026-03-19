import React, { useState } from 'react';
import { useAuthStore } from '../state-managment/auth.js';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    churchName: '',
    choirName: '',
    location: '',
    email: '',
    password: '',
    accessingPassword: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessPassword, setShowAccessPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (!formData.churchName.trim()) {
      newErrors.churchName = 'Church name is required';
    }

    if (!formData.choirName.trim()) {
      newErrors.choirName = 'Choir name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    if (!formData.accessingPassword) {
      newErrors.accessingPassword = 'Access password is required';
    } else if (formData.accessingPassword.length < 8) {
      newErrors.accessingPassword = 'Access password must be at least 8 characters';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log(formData);
      const res = await signup(formData);
      console.log(res);
      if (res) {
        navigate(`/verify-otp/${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowAccessPassword(!showAccessPassword);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <h1 className="signup-title">Hymnify</h1>
          <p className="signup-subtitle">Create your choir account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="fields-grid">
            {/* Church Name */}
            <div className="field-group">
              <label htmlFor="churchName">Church Name</label>
              <input
                type="text"
                id="churchName"
                name="churchName"
                value={formData.churchName}
                onChange={handleChange}
                placeholder="Enter your church name"
                className={errors.churchName ? 'input-error' : ''}
              />
              {errors.churchName && <span className="error-msg">{errors.churchName}</span>}
            </div>

            {/* Choir Name */}
            <div className="field-group">
              <label htmlFor="choirName">Choir Name</label>
              <input
                type="text"
                id="choirName"
                name="choirName"
                value={formData.choirName}
                onChange={handleChange}
                placeholder="Enter your choir name"
                className={errors.choirName ? 'input-error' : ''}
              />
              {errors.choirName && <span className="error-msg">{errors.choirName}</span>}
            </div>

            {/* Location */}
            <div className="field-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && <span className="error-msg">{errors.location}</span>}
            </div>

            {/* Email */}
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="field-hint">
                Min 8 characters with uppercase, lowercase, and number
              </span>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            {/* Access Password */}
            <div className="field-group">
              <label htmlFor="accessingPassword">Access Password</label>
              <div className="password-wrapper">
                <input
                  type={showAccessPassword ? 'text' : 'password'}
                  id="accessingPassword"
                  name="accessingPassword"
                  value={formData.accessingPassword}
                  onChange={handleChange}
                  placeholder="Set access password for members"
                  className={errors.accessingPassword ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => togglePasswordVisibility('access')}
                >
                  {showAccessPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="field-hint">
                Members will use this to access songs
              </span>
              {errors.accessingPassword && <span className="error-msg">{errors.accessingPassword}</span>}
            </div>
          </div>

          {/* Terms */}
          <div className="terms-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && <span className="error-msg">{errors.agreeTerms}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login link */}
          <p className="login-link">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;