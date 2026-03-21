// this is the controller for the songs model which is used to manage the songs in the database
// it includes functions to create, read, update, and delete songs
// this controller will be used in the routes to handle the requests related to songs
// the use cases includes adding a new song, getting all songs, getting a single song by id, updating a song by id, deleting a song by id
// and getting songs by owner id to manage the songs owned by a particular owner
// functions logics are these but not only uploadsong,getallpublic,deletesong,editsong
import Song  from "../model/songs.model.js"
import Owner from "../model/owner.model.js"
const song=Song;

export const getSongsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const songs = await Song.find({ owner: ownerId }).sort({ uploadedAt: -1 });
    res.status(200).json({ songs });
  } catch (error) {
    console.error("Error fetching owner songs:", error);
    res.status(500).json({ message: "Server error while fetching songs", error });
  }
};
export const uploadSong = async (req, res) => {
  try {
    const { title, artist,album, song, lyrics, genre, category,scope, description} = req.body;
    const { ownerId } = req.params;
    console.log("Owner ID:", ownerId);

    // Validate required fields
    if (!title || !artist || !ownerId) {
      return res.status(400).json({ message: "Missing required song details." });
    }

    // Optional: check for duplicates
    const existingSong = await Song.findOne({ title, artist,album,owner: ownerId });
    if (existingSong) {
      return res.status(409).json({ message: "Song already exists." });
    }

    const newSong = new Song({
      title,
      artist,
      song,
      owner: ownerId,
      lyrics,
      genre,
      category,
      album,
      scope,
      description,
    });

    await newSong.save();
    res.status(201).json({ newSong });
  } catch (error) {
    console.error("Error uploading song:", error);
    res.status(500).json({ message: "Server issue while uploading song.",error});
  }
};

export const getallpublic=async (req,res)=>{
  const publicSongs= await song.find({scope:'public'})
  res.status(200).json({publicSongs})
  

}
export const deleteSong = async (req, res) => {
  try {
    const { title, artist, album, category, scope } = req.body;
    const { ownerId } = req.params;

    const song = await Song.findOne({ title, artist, album, category, scope });

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Not authorized to delete this song" });
    }

    await Song.deleteOne({ _id: song._id });

    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting song",
      error
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { albumName } = req.body;
    const { ownerId } = req.params;

    if (!albumName) {
      return res.status(400).json({ message: "Album name is required" });
    }

    // Deleting an album means deleting all songs associated with it
    const result = await Song.deleteMany({ owner: ownerId, album: albumName });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No songs found for this album" });
    }

    return res.status(200).json({ 
      message: `Album '${albumName}' and its ${result.deletedCount} tracks deleted successfully` 
    });

  } catch (error) {
    console.error("Error in deleteAlbum:", error);
    return res.status(500).json({
      message: "Server error while deleting album",
      error
    });
  }
};

export const editsong=(req,res)=>{

}