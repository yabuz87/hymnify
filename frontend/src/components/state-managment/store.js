import { create } from "zustand";
import toast from "react-hot-toast";

// Actually, you have axiosInstance inside utils.js
import { axiosInstance as utilsAxios } from "../../libs/utils.js";

export const useSongStore = create((set, get) => ({
  songs: [],
  isLoadingSongs: false,
  isUploading: false,
  isDeleting: false,
  isEditing: false,

  // Fetch all public songs
  fetchAllPublicSongs: async () => {
    try {
      set({ isLoadingSongs: true });
      const response = await utilsAxios.get("/song/all");
      set({ songs: response.data.publicSongs || [] });
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to load public songs");
    } finally {
      set({ isLoadingSongs: false });
    }
  },

  // Fetch songs for a specific owner
  fetchOwnerSongs: async (ownerId) => {
    try {
      set({ isLoadingSongs: true });
      const response = await utilsAxios.get(`/song/owner/${ownerId}`);
      set({ songs: response.data.songs || [] });
    } catch (error) {
      console.error("Error fetching owner songs:", error);
      toast.error("Failed to load your songs");
    } finally {
      set({ isLoadingSongs: false });
    }
  },

  // Upload a new song/track
  uploadSong: async (ownerId, songData) => {
    try {
      set({ isUploading: true });
      /* 
        songData should contain: 
        { title, artist, album, song, lyrics, genre, category, scope, description }
      */
      const response = await utilsAxios.post(`/song/upload/${ownerId}`, songData);
      
      const newSong = response.data.newSong;
      set((state) => ({ songs: [...state.songs, newSong] }));
      
      toast.success("Song uploaded successfully!");
      return true;
    } catch (error) {
      console.error("Error uploading song:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload song";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isUploading: false });
    }
  },

  // Delete an entire album and all its tracks
  deleteAlbum: async (ownerId, albumName) => {
    try {
      set({ isDeleting: true });
      await utilsAxios.post(`/album/delete/${ownerId}`, { albumName });
      
      // Update local state by removing all songs belonging to this album
      set((state) => ({ 
        songs: state.songs.filter(song => song.album !== albumName)
      }));
      
      toast.success(`Album '${albumName}' deleted successfully!`);
      return true;
    } catch (error) {
      console.error("Error deleting album:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete album";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Delete an existing song
  deleteSong: async (ownerId, songData) => {
    try {
      set({ isDeleting: true });
      /* 
        Backend expects songData to contain:
        { title, artist, album, category, scope }
      */
      await utilsAxios.post(`/song/delete/${ownerId}`, songData);
      
      // Update local state by removing the song with matching details
      set((state) => ({ 
        songs: state.songs.filter(
          song => !(song.title === songData.title && song.artist === songData.artist && song.album === songData.album)
        ) 
      }));
      
      toast.success("Song deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting song:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete song";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Edit an existing song
  editSong: async (ownerId, songData) => {
    try {
      set({ isEditing: true });

      const response = await utilsAxios.post(`/song/edit/${ownerId}`, songData);
      const updatedSong = response.data.updatedSong;

      if (!updatedSong?._id) {
        throw new Error("Invalid updated song response");
      }
      
      set((state) => ({
        songs: state.songs.map((song) => 
          (song._id === updatedSong._id) ? updatedSong : song
        )
      }));
      
      toast.success("Song updated successfully!");
      return true;
    } catch (error) {
      console.error("Error editing song:", error);
      const errorMessage = error.response?.data?.message || "Failed to update song";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isEditing: false });
    }
  }
}));
