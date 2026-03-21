import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // usually important for identifying the song
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  scope:{
    enum:['public','private'],
    type:String,
    required:true   
  },
  song: {
    numbers:{
      type: Object,
      required: true,
      trim: true
    },
    chorus:{
      type: String,
      required: true,
      trim: true
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner', // corrected spelling: "Owner" not "Onwer"
    required: true
  },
  lyrics: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  album:{
    type:String,
  },
  description: { // corrected spelling
    type: String,
    trim: true
  }
});

// Create model
const Song = mongoose.model('Song', songSchema);

export default Song;
