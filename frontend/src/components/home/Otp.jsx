import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './otp.css'; // We'll create this CSS file

function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.split('');
      const newOtp = [...otp];
      pastedArray.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      
      // Focus on the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(digit => !digit);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex].focus();
      } else {
        inputRefs.current[5].focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - would typically redirect or show success message
      setSuccess('Email verified successfully! Redirecting...');
      
      // Clear success after 3 seconds
      setTimeout(() => {
        setSuccess('');
        // Redirect logic here
      }, 3000);
      
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset timer
      setTimer(600);
      setIsActive(true);
      
      // Show success message
      setSuccess('New OTP sent to your email!');
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      inputRefs.current[0].focus();
      
      // Clear success after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="container-fluid px-0">
        <div className="row g-0 min-vh-100">
          {/* Left side - Ambient section */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="ambient-section">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
              </div>
              <div className="ambient-content">
                <div className="ambient-icon">
                  <i className="bi bi-envelope-check"></i>
                </div>
                <h2 className="display-5 fw-bold mb-4">Verify Your Email</h2>
                <p className="lead mb-4">We've sent a verification code to your email address</p>
                
                <div className="verification-steps">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-text">Check your inbox</div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-text">Enter the 6-digit code</div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-text">Start managing your choir</div>
                  </div>
                </div>

                <div className="ambient-footer">
                  <i className="bi bi-shield-check me-2"></i>
                  <span>Your information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - OTP Form */}
          <div className="col-lg-6">
            <div className="form-section">
              <div className="form-wrapper">
                {/* Back to signup link */}
                <a href="#" className="back-link">
                  <i className="bi bi-arrow-left"></i>
                  Back to Sign Up
                </a>

                <div className="text-center mb-4">
                  <div className="mobile-ambient-icon d-lg-none mb-3">
                    <i className="bi bi-envelope-check"></i>
                  </div>
                  <h2 className="fw-bold">Verification Code</h2>
                  <p className="text-muted">
                    Please enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Timer Alert */}
                <div className={`timer-alert ${timer < 60 ? 'timer-warning' : ''}`}>
                  <i className="bi bi-clock-history me-2"></i>
                  Code expires in: <strong>{formatTime()}</strong>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* OTP Input Fields */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      Verification Code
                    </label>
                    <div className="otp-input-group">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          className="otp-input"
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          ref={(el) => (inputRefs.current[index] = el)}
                          maxLength={1}
                          autoFocus={index === 0}
                          disabled={isLoading || !isActive}
                        />
                      ))}
                    </div>
                    <div className="otp-hint">
                      <i className="bi bi-info-circle me-1"></i>
                      Check your spam folder if you don't see the email
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={isLoading || !isActive}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </button>

                  {/* Resend Section */}
                  <div className="text-center">
                    {!isActive ? (
                      <div className="expired-message mb-3">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        Code expired
                      </div>
                    ) : (
                      <p className="resend-text mb-2">
                        Didn't receive the code?
                      </p>
                    )}
                    
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                      onClick={handleResend}
                      disabled={isLoading}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i>
                      Resend Code
                    </button>
                  </div>

                  {/* Help Link */}
                  <div className="text-center mt-4">
                    <small className="text-muted">
                      Need help?{' '}
                      <a href="#" className="text-decoration-none">
                        Contact Support
                      </a>
                    </small>
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

export default OtpVerification;