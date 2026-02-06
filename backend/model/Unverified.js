import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const unverifiedSchema = new mongoose.Schema(
  {
    churchName: {
      type: String,
      required: true,
      trim: true,
    },
    choirName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      region: { type: String, trim: true },
      city: { type: String, trim: true },
      kebele: { type: String, trim: true },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accessingPassword: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // Optional future use (Cloudinary URL)
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    otpExpires: {
      type: Date,
      required:true,
    },
    otpCode: {
      type: String,
      required:true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }

);

unverifiedSchema.index({ email: 1 });


const Unverified = mongoose.model('Unverified', unverifiedSchema);

export default Unverified;
