import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// In your Signup component, import useNavigate
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // We'll create this custom CSS file

function Signup() {
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
    // Clear error for this field when user starts typing
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
      // API call would go here
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful signup
      alert('Signup successful! Please check your email for OTP.');
      navigate(`/verify-otp/${encodeURIComponent(formData.email)}`);
      
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
    <div className="signup-container">
      <div className="container-fluid px-0">
        <div className="row g-0 min-vh-100">
          {/* Left side - Image/Ambient section */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="ambient-section">
              <div className="ambient-content">
                <div className="floating-shapes">
                  <div className="shape shape-1"></div>
                  <div className="shape shape-2"></div>
                  <div className="shape shape-3"></div>
                </div>
                <div className="ambient-text">
                  <h1 className="display-4 fw-bold mb-4">Hymnify</h1>
                  <p className="lead mb-4">Bringing harmony to your choir management</p>
                  <div className="features-list">
                    <div className="feature-item">
                      <i className="bi bi-music-note-beamed"></i>
                      <span>Easy choir management</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-envelope-paper"></i>
                      <span>Secure OTP verification</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-shield-check"></i>
                      <span>Protected access passwords</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup form */}
          <div className="col-lg-6">
            <div className="form-section">
              <div className="form-wrapper">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted">Join Hymnify and start managing your choir</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Church Name */}
                  <div className="mb-3">
                    <label htmlFor="churchName" className="form-label fw-medium">
                      Church Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.churchName ? 'is-invalid' : ''}`}
                      id="churchName"
                      name="churchName"
                      value={formData.churchName}
                      onChange={handleChange}
                      placeholder="Enter your church name"
                    />
                    {errors.churchName && (
                      <div className="invalid-feedback">{errors.churchName}</div>
                    )}
                  </div>

                  {/* Choir Name */}
                  <div className="mb-3">
                    <label htmlFor="choirName" className="form-label fw-medium">
                      Choir Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.choirName ? 'is-invalid' : ''}`}
                      id="choirName"
                      name="choirName"
                      value={formData.choirName}
                      onChange={handleChange}
                      placeholder="Enter your choir name"
                    />
                    {errors.choirName && (
                      <div className="invalid-feedback">{errors.choirName}</div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label fw-medium">
                      Location
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State"
                    />
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-medium">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                    <small className="text-muted">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </small>
                  </div>

                  {/* Access Password */}
                  <div className="mb-4">
                    <label htmlFor="accessingPassword" className="form-label fw-medium">
                      Access Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showAccessPassword ? 'text' : 'password'}
                        className={`form-control ${errors.accessingPassword ? 'is-invalid' : ''}`}
                        id="accessingPassword"
                        name="accessingPassword"
                        value={formData.accessingPassword}
                        onChange={handleChange}
                        placeholder="Set access password for members"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility('access')}
                      >
                        {showAccessPassword ? 'Hide' : 'Show'}
                      </button>
                      {errors.accessingPassword && (
                        <div className="invalid-feedback">{errors.accessingPassword}</div>
                      )}
                    </div>
                    <small className="text-muted">
                      This password will be used by choir members to access songs
                    </small>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="agreeTerms">
                        I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                      </label>
                      {errors.agreeTerms && (
                        <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <a href="#" className="text-decoration-none fw-medium">
                        Sign In
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;