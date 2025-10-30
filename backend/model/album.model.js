import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist", // assuming you have an Artist model
    required: true
  },
  releaseDate: {
    type: Date,
  },
  coverImage: {
    type: String, // URL
  },
  description: {
    type: String,
  }
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);

export default Album;
