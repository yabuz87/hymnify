// here is the controller for the ownership model which is used to manage the ownership of the songs
// it includes functions to create, read, update, the songs owned by a particular owner
// and delete the songs owned by a particular owner
// this controller will be used in the routes to handle the requests related to ownership of songs
// the use cases includes signing up as an owner, logging in as an owner, upating owner details, deleting owner account

import Owner from '../model/owner.model.js';
import Song  from '../model/songs.model.js';
import dotenv from 'dotenv';
import Unverified from '../model/Unverified.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { generateToken } from "../libs/utils.js"; // your JWT function
dotenv.config();

const owner=Owner;
const song=Song;


// Function to sign up a new owner
const generateOTP=()=>{
   return Math.floor(100000+Math.random()*900000).toString();
}
export const signUp = async (req, res) => {
  try {
    const {
      churchName,
      choirName,
      location,
      email,
      password,
      accessingPassword,
    } = req.body;

    const existingOwner = await owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({
        message: "Owner with this email already exists",
      });
    }

    const existingUnverified = await Unverified.findOne({ email });
      if (existingUnverified && existingUnverified.otpExpires > Date.now()) {
      return res.status(400).json({
        message: "OTP already sent. Please verify your email.",
      });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAccessingPassword = await bcrypt.hash(accessingPassword, 10);

    const otpCode = generateOTP();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const newOwner = new Unverified({
      churchName,
      choirName,
      location,
      email,
      password: hashedPassword,
      accessingPassword: hashedAccessingPassword,
      otpCode: hashedOtp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await newOwner.save();
    await sendOtpEmail(email, otpCode);

    return res.status(201).json({
      message: "We've sent you an OTP to your email. Check inbox or spam.",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const sendOtpEmail = async (email, otpCode) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Use 587 for STARTTLS
    secure: false, // false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: 'SSLv3', // Sometimes needed for older servers
      rejectUnauthorized: false // Use with caution, only in dev
    }
  });

  await transporter.sendMail({
    from: `hymnify app <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `<h3>Your verification code</h3>
           <h4>${otpCode}</h4>
           <p>This code will expire in 10 minutes.</p>`
  });
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const unverifiedUser = await Unverified.findOne({ email });
    if (!unverifiedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check expiration first
    if (unverifiedUser.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare entered OTP with hashed OTP
    const isValid = await bcrypt.compare(otp, unverifiedUser.otpCode);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Move user to Owner collection, excluding OTP fields
    const finalData = await Unverified
      .findOne({ email })
      .select("-otpCode -otpExpires");

    const verifiedOwner = new owner(finalData.toObject());
    await verifiedOwner.save();

    // Delete unverified record
    await Unverified.deleteOne({ _id: unverifiedUser._id });

    res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// function to log in as existing owner

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1 Check if email exists
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️ Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️ Generate JWT token and set cookie
    generateToken(owner._id, res);

    // 4️ Return success response (excluding passwords)
    res.status(200).json({
      message: "Login successful",
      owner: {
        _id: owner._id,
        churchName: owner.churchName,
        choirName: owner.choirName,
        email: owner.email,
        location: owner.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


// login function for client

export const loginClient = async (req, res) => {
  try {
    const { churchName, choirName, accessingPassword, location } = req.body;

    // 1️ Find the owner by choir, church, and location
    const owner = await Owner.findOne({
      churchName,
      choirName,
      location
    });

    // 2️ If no owner found
    if (!owner) {
      return res.status(400).json({ message: "Owner not found with the provided details." });
    }

    // 3️ Compare accessingPassword with the hashed one in DB
    const isMatch = await bcrypt.compare(accessingPassword, owner.accessingPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid accessing password." });
    }


   // 4️ Fetch all songs that belong to this owner
    const songs = await song.find({ owner: owner._id }).sort({ uploadedAt: -1 }); // latest first

  //  5️ Return owner info + songs
    res.status(200).json({
      message: "Client login successful",
      owner: {
        id: owner._id,
        churchName: owner.churchName,
        choirName: owner.choirName,
        location: owner.location,
      },
      songs,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// OwnerController.js
export const logoutAdmin = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true, // must match your cookie options in generateToken
      secure: process.env.NODE_ENV === "production", // same as your login cookie
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// OwnerController.js
export const logoutClient = async (req, res) => {
  try {
    // Optional: you could just return success
    res.status(200).json({ message: "Client logged out successfully" });
  } catch (error) {
    console.error("Client logout error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
