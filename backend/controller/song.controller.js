// this is the controller for the songs model which is used to manage the songs in the database
// it includes functions to create, read, update, and delete songs
// this controller will be used in the routes to handle the requests related to songs
// the use cases includes adding a new song, getting all songs, getting a single song by id, updating a song by id, deleting a song by id
// and getting songs by owner id to manage the songs owned by a particular owner
// functions logics are these but not only uploadsong,getallpublic,deletesong,editsong
import Song  from "../model/songs.model.js"
import Owner from "../model/owner.model.js"
const song=Song;
export const uploadSong = async (req, res) => {
  try {
    const { title, artist, song, lyrics, genre, category,scope, description} = req.body;
    const { ownerId } = req.params;
    console.log("Owner ID:", ownerId);

    // Validate required fields
    if (!title || !artist || !ownerId) {
      return res.status(400).json({ message: "Missing required song details." });
    }

    // Optional: check for duplicates
    // const existingSong = await Song.findOne({ title, artist, album, owner: ownerId });
    // if (existingSong) {
    //   return res.status(409).json({ message: "Song already exists." });
    // }

    const newSong = new song({
      title,
      artist,
      song,
      owner: ownerId,
      lyrics,
      genre,
      category,
      scope,
      description,
    });

    await newSong.save();
    res.status(201).json({ newSong });
  } catch (error) {
    console.error("Error uploading song:", error);
    res.status(500).json({ message: "Server issue while uploading song." });
  }
};

export const getallpublic=async (req,res)=>{
  const publicSongs= await song.find({scope:'public'})
  res.status(200).json({publicSongs})
  

}
export const deletesong=(req,res)=>{


}
export const editsong=(req,res)=>{

}