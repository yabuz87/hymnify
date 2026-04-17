import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './components/home/Signup';
import Login from './components/home/Login';
import OtpVerification from './components/home/Otp';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/home/navbar/Navbar';
import Home from './components/home/Home';
import About from './components/home/About';
import Footer from './components/home/footer/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import Features from './components/home/Features';
import Contact from './components/home/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="bottom-right" reverseOrder={false} />
       <Navbar/>
        <Routes>
          {/* Home Page (Landing) */}
          <Route path="/" element={<Home />} />
          
          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* OTP Verification Page */}
          <Route path="/verify-otp" element={<OtpVerification />} />
          
          {/* Optional: Add a route with email parameter */}
          <Route path="/verify-otp/:email" element={<OtpVerification />} />

          {/* About Page */}
          <Route path="/about" element={<About />} />

          {/* Features Page */}
          <Route path="/features" element={<Features />} />

          {/* Contact Page */}
          <Route path="/contact" element={<Contact />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;