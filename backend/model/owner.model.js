import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// this file is the data model for the owner of the songs (church/choir) in the database the song model will reference this model
// it includes fields for church name, choir name, location, email, password, profile image, and timestamps
// here the data is only for the admin dashboard to manage songs and for unique identifcation the location and the email  and the church name is important 
// the password is hashed for security
// the profile image is optional and can be added later
// the general song which is publicly available does not need to reference this model
// but for the admin dashboard to manage songs it is important to have this model



const ownerSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

// 🔐 Index for fast email lookup
ownerSchema.index({ email: 1 });


const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
