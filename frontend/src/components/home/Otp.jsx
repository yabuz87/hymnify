import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../state-managment/auth.js';
import { useNavigate } from 'react-router-dom';
import './otp.css';

function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputRefs = useRef([]);
  const { verify, verifyData } = useAuthStore();
  const navigate = useNavigate();

  // Set email when verifyData is available
  useEffect(() => {
    if (verifyData?.email) setEmail(verifyData.email);
  }, [verifyData]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const arr = pasted.split('');
      const newOtp = [...otp];
      arr.forEach((d, i) => { if (i < 6) newOtp[i] = d; });
      setOtp(newOtp);
      const nextEmpty = newOtp.findIndex(d => !d);
      if (nextEmpty !== -1) inputRefs.current[nextEmpty].focus();
      else inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = { email, otp: otpString };
      console.log(data, "verify-data", verifyData);
      const res = await verify(data);
      if (res) {
        setSuccess('Email verified! Redirecting to Log In...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Call your resend OTP API here if implemented
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTimer(600);
      setIsActive(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      setSuccess('New OTP sent to your email!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        {/* Header */}
        <div className="otp-header">
          <h1 className="otp-title">Verify Your Email</h1>
          <p className="otp-subtitle">
            We sent a 6-digit code to <strong>{email || 'your email'}</strong>
          </p>
        </div>

        {/* Timer */}
        <div className={`otp-timer ${timer <= 60 ? 'otp-timer--warn' : ''}`}>
          <span className="otp-timer-label">Time remaining</span>
          <span className="otp-timer-value">{formatTime()}</span>
        </div>

        {/* Messages */}
        {success && <div className="otp-msg otp-msg--success">{success}</div>}
        {error && <div className="otp-msg otp-msg--error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="otp-form">
          {/* OTP Inputs */}
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="otp-digit"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={el => (inputRefs.current[index] = el)}
                maxLength={1}
                autoFocus={index === 0}
                disabled={isLoading || !isActive}
              />
            ))}
          </div>
          <span className="otp-hint">Check your spam folder if you don't see the email</span>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !isActive}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Footer */}
          <div className="otp-footer">
            {!isActive && <span className="otp-expired">Code expired</span>}
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={isLoading}
            >
              Resend Code
            </button>
            <a href="/signup" className="back-link">← Back to Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;