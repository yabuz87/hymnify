import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state-managment/auth';
import { useSongStore } from '../state-managment/store';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { authUser, isCheckingAuth } = useAuthStore();
  const { songs, fetchOwnerSongs, isLoadingSongs, uploadSong, deleteSong, editSong } = useSongStore();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate('/');
    }
  }, [isCheckingAuth, authUser, navigate]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSongViewOpen, setIsSongViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState('albums'); // 'albums' or 'album-detail'
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState('song'); // 'song' or 'album'
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);


  // Unified Form State for Song Model
  const initialFormState = {
    title: '',
    artist: '',
    album: '',
    scope: 'public',
    genre: '',
    category: '',
    description: '',
    chorus: '',
    verses: [''], // Array of strings for dynamic verses
  };
  const [formData, setFormData] = useState(initialFormState);
  const isSearching = searchTerm.trim().length > 0;

  // Fetch Admin's Songs
  useEffect(() => {
    if (authUser?._id) {
      fetchOwnerSongs(authUser._id);
    }
  }, [authUser, fetchOwnerSongs]);

  // Aggregate Songs into "Albums" logically with SEARCH filtering
  const albums = useMemo(() => {
    if (!songs || songs.length === 0) return [];

    // Filter songs first based on searchTerm
    const filteredSongs = songs.filter(song => {
      const searchLower = searchTerm.toLowerCase();
      return (
        song.title?.toLowerCase().includes(searchLower) ||
        song.artist?.toLowerCase().includes(searchLower) ||
        song.album?.toLowerCase().includes(searchLower) ||
        song.genre?.toLowerCase().includes(searchLower) ||
        song.category?.toLowerCase().includes(searchLower)
      );
    });

    const albumsMap = {};
    filteredSongs.forEach(song => {
      const albumName = song.album && song.album.trim() !== '' ? song.album : "Singles";
      if (!albumsMap[albumName]) {
        albumsMap[albumName] = {
          id: albumName,
          title: albumName,
          artist: song.artist || authUser?.choirName || 'Unknown Artist',
          coverUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(albumName)}&size=300&background=random`,
          tracks: []
        };
      }
      albumsMap[albumName].tracks.push(song);
    });
    return Object.values(albumsMap);
  }, [songs, authUser, searchTerm]);


  // ── Actions ──

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setViewMode('album-detail');
  };

  const handleBackToAlbums = () => {
    setViewMode('albums');
    setSelectedAlbum(null);
  };

  const openUploadModal = (prefillAlbum = '') => {
    setIsEditMode(false);
    setFormData({
      ...initialFormState,
      artist: authUser?.choirName || '',
      album: prefillAlbum
    });
    setIsModalOpen(true);
  };

  const openEditModal = (songToEdit) => {
    if (!songToEdit?._id) {
      toast.error("Unable to edit this song.");
      return;
    }

    const verseEntries = Object.entries(songToEdit.song?.numbers || {})
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, verse]) => verse || '');

    setFormData({
      title: songToEdit.title || '',
      artist: songToEdit.artist || authUser?.choirName || '',
      album: songToEdit.album || '',
      scope: songToEdit.scope || 'public',
      genre: songToEdit.genre || '',
      category: songToEdit.category || '',
      description: songToEdit.description || '',
      chorus: songToEdit.song?.chorus || '',
      verses: verseEntries.length > 0 ? verseEntries : [''],
    });

    setIsEditMode(true);
    setIsSongViewOpen(false);
    setIsModalOpen(true);
  };

  const openSongView = (song, album) => {
    setSelectedSong(song);
    setSelectedAlbum(album);
    setIsSongViewOpen(true);
  };

  const closeSongView = () => {
    setIsSongViewOpen(false);
    setSelectedSong(null);
  };

  const openDeleteConfirm = (song, album) => {
    setSelectedSong(song);
    setSelectedAlbum(album);
    setDeleteMode('song');
    setIsDeleteConfirmOpen(true);
  };

  const openDeleteAlbumConfirm = (e, album) => {
    e.stopPropagation(); // Avoid triggering handleAlbumClick
    setSelectedAlbum(album);
    setDeleteMode('album');
    setIsDeleteConfirmOpen(true);
  };

  // ── Submissions ──

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    // Convert array of verses into object with numeric keys {"1": verse1, "2": verse2}
    const numbersMap = {};
    formData.verses.forEach((verse, index) => {
      if (verse.trim()) {
        numbersMap[String(index + 1)] = verse.trim();
      }
    });

    // Construct the payload to match the backend Schema exactly
    const songPayload = {
      title: formData.title,
      artist: formData.artist,
      album: formData.album,
      scope: formData.scope,
      genre: formData.genre,
      category: formData.category,
      description: formData.description,
      song: {
        numbers: numbersMap,
        chorus: formData.chorus
      },
    };

    const success = isEditMode && selectedSong?._id
      ? await editSong(authUser._id, { songId: selectedSong._id, ...songPayload })
      : await uploadSong(authUser._id, songPayload);

    if (success) {
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData(initialFormState);
      if (selectedSong?._id) {
        const refreshedSong = useSongStore.getState().songs.find((song) => song._id === selectedSong._id);
        if (refreshedSong) {
          setSelectedSong(refreshedSong);
        }
      }
    }
  };

  const handleDeleteAction = async () => {
    if (deleteMode === 'song') {
      if (!selectedSong) return;
      const success = await deleteSong(authUser._id, {
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        category: selectedSong.category,
        scope: selectedSong.scope
      });
      if (success) {
        setIsDeleteConfirmOpen(false);
        setIsSongViewOpen(false);
        setSelectedSong(null);
      }
    } else {
      if (!selectedAlbum) return;
      const success = await useSongStore.getState().deleteAlbum(authUser._id, selectedAlbum.title);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedAlbum(null);
      }
    }
  };

  // ── Render Helpers ──

  const renderLyrics = (text) => {
    if (!text) return null;
    return text.split(',').map((line, i) => (
      <span key={i}>
        {line.trim()}
        {i < text.split(',').length - 1 && <br />}
      </span>
    ));
  };

  if (isLoadingSongs) {
    return (
      <div className="admin-loading">
        <span className="spinner-large"></span>
        <p>Loading Your Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-info">
          {viewMode === 'album-detail' ? (
            <div className="back-nav">
              <button className="btn-back" onClick={handleBackToAlbums}>
                <i className="bi bi-arrow-left"></i> Back to Albums
              </button>
              <h1>{selectedAlbum?.title}</h1>
            </div>
          ) : (
            <>
              <h1>Song & Album Management</h1>
              <p>Manage your church choir's complete music catalog securely.</p>
            </>
          )}
        </div>

        <div className="header-actions">
          {viewMode === 'albums' && (
            <div className="dashboard-search-container">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search songs, artists, or albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dashboard-search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          )}
          <button className="btn-primary" onClick={() => openUploadModal(viewMode === 'album-detail' ? selectedAlbum?.title : '')}>
            <i className="bi bi-cloud-arrow-up-fill"></i> {viewMode === 'album-detail' ? 'Add Track to Album' : 'Upload New Song'}
          </button>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="admin-empty-state">
          <div className="empty-icon">
            <i className="bi bi-music-note-list"></i>
          </div>
          <h2>No Music Found</h2>
          <p>Your catalog is completely empty. Upload your first song to see it grouped by album!</p>
          <button className="btn-primary mt-3" onClick={() => openUploadModal('')}>
            <i className="bi bi-cloud-arrow-up-fill"></i> Upload Your First Song
          </button>
        </div>
      ) : albums.length === 0 ? (
        <div className="admin-no-results fade-in">
          <div className="no-results-icon">
            <i className="bi bi-search"></i>
          </div>
          <h2>No matches found</h2>
          <p>We couldn't find anything matching "<strong>{searchTerm}</strong>".</p>
          <button className="btn-text" onClick={() => setSearchTerm('')}>
            Clear search <i className="bi bi-x-circle"></i>
          </button>
        </div>
      ) : viewMode === '__never__' ? (
        <div className="admin-grid">
          {albums.map((album) => (
            <div key={album.id} className="album-card fade-in" onClick={() => handleAlbumClick(album)}>
              <div className="album-cover">
                <img src={album.coverUrl} alt={album.title} />
                <div className="album-card-overlay">
                  <button
                    className="icon-btn delete-btn"
                    onClick={(e) => openDeleteAlbumConfirm(e, album)}
                    title="Delete entire album"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
              <div className="album-details">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-artist">{album.artist}</p>
                <div className="album-meta">
                  <span className="track-count">
                    <i className="bi bi-music-note"></i> {album.tracks.length} Tracks
                  </span>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlbumClick(album);
                    }}
                  >
                    View tracks <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'albums' ? (
        <>
          <div className="admin-grid">
            {albums.map((album) => (
              <div key={album.id} className="album-card fade-in" onClick={() => handleAlbumClick(album)}>
                <div className="album-cover">
                  <img src={album.coverUrl} alt={album.title} />
                  <div className="album-card-overlay">
                    <button
                      className="icon-btn delete-btn"
                      onClick={(e) => openDeleteAlbumConfirm(e, album)}
                      title="Delete entire album"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="album-details">
                  <h3 className="album-title">{album.title}</h3>
                  <p className="album-artist">{album.artist}</p>
                  <div className="album-meta">
                    <span className="track-count">
                      <i className="bi bi-music-note"></i> {album.tracks.length} Tracks
                    </span>
                    <button
                      type="button"
                      className="btn-text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlbumClick(album);
                      }}
                    >
                      View tracks <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isSearching && albums.length > 0 && (
            <div className="filtered-tracks-section fade-in">
              <h2 className="filtered-tracks-title">Filtered Tracks</h2>

              {albums.map((album) => (
                <div key={`filtered-${album.id}`} className="filtered-album-tracks">
                  <div className="filtered-album-tracks-header">
                    <div className="filtered-album-tracks-title">
                      <span className="filtered-album-tracks-album">{album.title}</span>
                      <span className="filtered-album-tracks-artist">{album.artist}</span>
                    </div>
                    <span className="filtered-album-tracks-count">{album.tracks.length} songs</span>
                  </div>

                  <div className="filtered-track-list">
                    {album.tracks.map((track, idx) => (
                      <div
                        key={track._id || `${album.id}-${track.title}-${idx}`}
                        className="track-preview-item"
                        onClick={() => openSongView(track, album)}
                        title="View lyrics"
                      >
                        <span className="track-preview-index">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="track-preview-name">{track.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="album-detail-view fade-in">
          <div className="track-list-detailed">
            {selectedAlbum?.tracks.map((track, i) => (
              <div key={track._id} className="detail-track-item" onClick={() => openSongView(track, selectedAlbum)}>
                <div className="track-info-main">
                  <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="track-text">
                    <h4>{track.title}</h4>
                    <p>{track.genre} &bull; {track.category}</p>
                  </div>
                </div>
                <div className="track-actions-peek">
                  <button className="btn-view-song">View Lyrics <i className="bi bi-eye"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Upload Modal ── */}
      {isModalOpen && (
        <div className="modal-backdrop fade-in">
          <form onSubmit={handleModalSubmit} className="modal-content large-modal scale-in" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Song' : 'Upload New Song'}</h2>
              <button
                className="close-btn"
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

                {/* Left Column */}
                <div style={{ flex: '1 1 300px' }}>
                  <div className="form-group">
                    <label>Track Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Amazing Grace (Amharic)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Choir / Artist *</label>
                    <input
                      type="text"
                      required
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Album Name (Optional, used for grouping)</label>
                    <input
                      type="text"
                      value={formData.album}
                      onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                      placeholder="e.g. Volume 1: Grace"
                    />
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Scope *</label>
                      <select
                        required
                        value={formData.scope}
                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Genre</label>
                      <input
                        type="text"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        placeholder="e.g. Gospel"
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Worship"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ flex: '1 1 300px' }}>
                  <div className="form-group">
                    <label>Chorus Lyrics *</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.chorus}
                      onChange={(e) => setFormData({ ...formData, chorus: e.target.value })}
                      placeholder="Enter the chorus here..."
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label>Song Verses / Numbers *</label>
                    {formData.verses.map((verse, index) => (
                      <div key={index} style={{ position: 'relative', marginBottom: '0.75rem' }}>

                        {/* Absolute Positioned Number */}
                        <div style={{
                          position: 'absolute',
                          top: '0.8rem',
                          left: '0.8rem',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}>
                          {index + 1}.
                        </div>

                        <textarea
                          required
                          rows="2"
                          value={verse}
                          onChange={(e) => {
                            const newVerses = [...formData.verses];
                            newVerses[index] = e.target.value;
                            setFormData({ ...formData, verses: newVerses });
                          }}
                          placeholder="Enter lyrics for this number..."
                          style={{
                            width: '100%',
                            resize: 'vertical',
                            paddingLeft: '2.5rem', // Make room for the number
                            paddingRight: formData.verses.length > 1 ? '3rem' : '1rem' // Make room for trash icon
                          }}
                        />

                        {/* Absolute Positioned Delete Button */}
                        {formData.verses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newVerses = formData.verses.filter((_, i) => i !== index);
                              setFormData({ ...formData, verses: newVerses });
                            }}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              color: '#dc3545',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: '0.2s ease',
                              outline: 'none'
                            }}
                            title="Remove this verse"
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, verses: [...formData.verses, ''] })}
                      style={{
                        background: 'transparent', border: '1px dashed var(--border-color)',
                        width: '100%', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer',
                        color: 'var(--text-secondary)', fontWeight: '500', transition: '0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className="bi bi-plus-lg me-2"></i> Add Another Verse / Number
                    </button>
                  </div>
                </div>

              </div>

              <div className="form-group mt-2">
                <label>Description (Optional)</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide additional details or story behind the song..."
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <i className={`bi ${isEditMode ? 'bi-check2-circle' : 'bi-cloud-arrow-up-fill'} me-2`}></i>
                {isEditMode ? 'Save Changes' : 'Upload Song'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Song Details View Modal ── */}
      {isSongViewOpen && selectedSong && (
        <div className="modal-backdrop fade-in" onClick={closeSongView}>
          <div className="modal-content large-modal scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%' }}>

            <div className="modal-header">
              <div>
                <h2>{selectedSong.title}</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {selectedSong.artist} &bull; {selectedSong.album || 'Singles'} &bull; {selectedSong.scope}
                </span>
              </div>
              <button className="close-btn" onClick={closeSongView}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body" style={{ background: 'var(--bg-page)' }}>

              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Chorus</h4>
                <p style={{ margin: 0, lineHeight: '1.6', fontWeight: '500' }}>
                  {renderLyrics(selectedSong.song?.chorus)}
                </p>
              </div>

              {selectedSong.song?.numbers && Object.entries(selectedSong.song.numbers).map(([num, verse]) => (
                <div key={num} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--bg-btn)', fontSize: '1.1rem' }}>{num}.</div>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{renderLyrics(verse)}</p>
                </div>
              ))}

              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Metadata</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {renderLyrics(selectedSong.description) || 'No description available.'}
                </p>
              </div>

            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => openEditModal(selectedSong)}
                >
                  <i className="bi bi-pencil-square me-2"></i> Edit Song
                </button>
                <button className="btn-danger" onClick={() => openDeleteConfirm(selectedSong, selectedAlbum)}>
                  <i className="bi bi-trash-fill me-2"></i> Delete Song
                </button>
              </div>
              <button className="btn-cancel" onClick={closeSongView}>Close</button>
            </div>

          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteConfirmOpen && (
        <div className="modal-backdrop fade-in" style={{ zIndex: 1050 }}>
          <div className="modal-content delete-modal scale-in">
            <div className="modal-icon text-danger">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2>{deleteMode === 'song' ? 'Delete Song?' : 'Delete Album?'}</h2>
            <p>
              Are you sure you want to permanently delete
              <strong> "{deleteMode === 'song' ? selectedSong?.title : selectedAlbum?.title}"</strong>?
              {deleteMode === 'album' && " This will remove all tracks inside this album."}
            </p>
            <div className="modal-footer justify-center pt-3">
              <button className="btn-cancel" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteAction}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
