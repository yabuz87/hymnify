import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/home/Signup';
import OtpVerification from './components/home/Otp';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/home/navbar/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
       <Navbar/>
        <Routes>
          {/* Default route redirects to signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          
          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />
          
          {/* OTP Verification Page */}
          <Route path="/verify-otp" element={<OtpVerification />} />
          
          {/* Optional: Add a route with email parameter */}
          <Route path="/verify-otp/:email" element={<OtpVerification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;