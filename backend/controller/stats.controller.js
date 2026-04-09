import Song from "../model/songs.model.js";
import Owner from "../model/owner.model.js";

export const getAppStats = async (req, res) => {
  try {
    const songCount = await Song.countDocuments();
    const ownerCount = await Owner.countDocuments();
    
    res.status(200).json({
      churchCount: ownerCount,
      songCount: songCount
    });
  } catch (error) {
    console.error("Error in getAppStats:", error);
    res.status(500).json({ 
      message: "Error fetching application statistics", 
      error: error.message 
    });
  }
};
