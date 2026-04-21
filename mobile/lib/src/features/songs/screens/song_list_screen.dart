import 'package:flutter/material.dart';
import '../data/song_repository.dart';
import '../models/song.dart';
import 'song_detail_screen.dart';
import '../../../app.dart';

class SongListScreen extends StatefulWidget {
  const SongListScreen({super.key});

  @override
  State<SongListScreen> createState() => _SongListScreenState();
}

enum ViewMode { bySong, byAlbum, favorites }

class _SongListScreenState extends State<SongListScreen> {
  final SongRepository _repository = SongRepository();
  final TextEditingController _searchController = TextEditingController();

  List<Song> _songs = <Song>[];
  bool _isLoading = true;
  String _query = '';
  String? _errorMessage;
  ViewMode _viewMode = ViewMode.bySong;

  @override
  void initState() {
    super.initState();
    _loadSongs();
  }

  Future<void> _loadSongs() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final songs = await _repository.fetchPublicSongs();
      final offlineIds = await _repository.getOfflineSongIds();
      final favoriteIds = await _repository.getFavoriteSongIds();

      if (!mounted) return;
      setState(() {
        _songs = songs
            .map(
              (song) => song.copyWith(
                isDownloaded: offlineIds.contains(song.id),
                isFavorite: favoriteIds.contains(song.id),
              ),
            )
            .toList();
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Failed to load songs from API.';
      });
    } finally {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleFavoriteSong(String id) async {
    Song? target;
    for (final song in _songs) {
      if (song.id == id) {
        target = song;
        break;
      }
    }
    if (target == null) return;

    await _repository.toggleFavoriteOffline(target);
    setState(() {
      _songs = _songs
          .map((song) => song.id == id ? song.copyWith(isFavorite: !target!.isFavorite) : song)
          .toList();
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(target.isFavorite ? 'Removed from favorites' : 'Added to favorites')),
      );
    }
  }

  Future<void> _toggleDownloadSong(String id) async {
    Song? target;
    for (final song in _songs) {
      if (song.id == id) {
        target = song;
        break;
      }
    }
    if (target == null) return;

    if (target.isDownloaded) {
      final confirm = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Remove from Offline?'),
          content: Text('Are you sure you want to remove "${target!.title}" from your downloaded library?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Remove', style: TextStyle(color: Colors.red)),
            ),
          ],
        ),
      );

      if (confirm != true) return;

      await _repository.deleteOfflineSong(target.id);
      setState(() {
        _songs = _songs
            .map((song) => song.id == id ? song.copyWith(isDownloaded: false) : song)
            .toList();
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Song removed from offline bucket.')),
        );
      }
    } else {
      await _repository.saveSongOffline(target);
      setState(() {
        _songs = _songs
            .map((song) => song.id == id ? song.copyWith(isDownloaded: true, hasUpdate: false) : song)
            .toList();
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Song prepared for offline use.')),
        );
      }
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _songs.where((song) {
      if (_viewMode == ViewMode.favorites && !song.isFavorite) return false;
      final q = _query.toLowerCase();
      return song.title.toLowerCase().contains(q) ||
          song.artist.toLowerCase().contains(q) ||
          song.album.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Public Library'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(), 
        ),
        actions: [
          IconButton(
            icon: Icon(Theme.of(context).brightness == Brightness.dark ? Icons.light_mode : Icons.dark_mode),
            onPressed: () {
              themeNotifier.value = Theme.of(context).brightness == Brightness.dark ? ThemeMode.light : ThemeMode.dark;
            },
          ),
          IconButton(
            tooltip: 'Refresh',
            onPressed: _loadSongs,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Find hymns, artists, albums...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF3D5AFE)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
                suffixIcon: _query.isEmpty
                    ? null
                    : IconButton(
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _query = '');
                        },
                        icon: const Icon(Icons.clear),
                      ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onChanged: (value) => setState(() => _query = value.trim()),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text('Fetching spiritual melodies...'),
                      ],
                    ),
                  )
                : _errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline, size: 64, color: Colors.redAccent),
                              const SizedBox(height: 16),
                              Text(
                                _errorMessage!,
                                textAlign: TextAlign.center,
                                style: const TextStyle(fontSize: 16),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton.icon(
                                onPressed: _loadSongs,
                                icon: const Icon(Icons.replay),
                                label: const Text('Try Again'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            child: SegmentedButton<ViewMode>(
                              segments: const [
                                ButtonSegment(value: ViewMode.bySong, icon: Icon(Icons.list), label: Text('Songs')),
                                ButtonSegment(value: ViewMode.favorites, icon: Icon(Icons.favorite), label: Text('Favs')),
                                ButtonSegment(value: ViewMode.byAlbum, icon: Icon(Icons.album), label: Text('Albums')),
                              ],
                              selected: {_viewMode},
                              onSelectionChanged: (Set<ViewMode> selection) {
                                setState(() {
                                  _viewMode = selection.first;
                                });
                              },
                              style: SegmentedButton.styleFrom(
                                selectedBackgroundColor: Theme.of(context).colorScheme.primaryContainer,
                              ),
                            ),
                          ),
                          Expanded(
                            child: filtered.isEmpty
                                ? Center(
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.music_off, size: 64, color: Colors.grey.withOpacity(0.5)),
                                        const SizedBox(height: 16),
                                        Text(
                                          _query.isEmpty ? 'No songs in the library yet.' : 'No match found for "$_query"',
                                          style: TextStyle(color: Colors.grey[600], fontSize: 16),
                                        ),
                                      ],
                                    ),
                                  )
                                : RefreshIndicator(
                                    onRefresh: _loadSongs,
                                    child: _viewMode == ViewMode.byAlbum 
                                      ? _buildGroupedByAlbum(filtered)
                                      : ListView.builder(
                                          padding: const EdgeInsets.symmetric(vertical: 8),
                                          itemCount: filtered.length,
                                          itemBuilder: (context, index) {
                                            return _buildSongCard(filtered[index]);
                                          },
                                        ),
                                  ),
                          ),
                        ],
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildGroupedByAlbum(List<Song> filteredSongs) {
    final Map<String, List<Song>> grouped = {};
    for (final s in filteredSongs) {
      final albumName = s.album.trim().isEmpty ? 'Singles / Unknown Album' : s.album.trim();
      grouped.putIfAbsent(albumName, () => []).add(s);
    }
    
    final sortedKeys = grouped.keys.toList()..sort((a, b) => a.compareTo(b));

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: sortedKeys.length,
      itemBuilder: (context, index) {
        final albumName = sortedKeys[index];
        final albumSongs = grouped[albumName]!;
        
        return Theme(
          data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
          child: ExpansionTile(
            initiallyExpanded: index == 0,
            leading: const Icon(Icons.album, color: Color(0xFF3D5AFE)),
            title: Text(albumName, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${albumSongs.length} hymn${albumSongs.length == 1 ? '' : 's'}'),
            children: albumSongs.map((song) => _buildSongCard(song)).toList(),
          ),
        );
      },
    );
  }

  Widget _buildSongCard(Song song) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: Colors.grey.withOpacity(0.1)),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
          leading: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
            child: Text(
              song.title.isNotEmpty ? song.title[0].toUpperCase() : '?',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onPrimaryContainer,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          title: Text(
            song.title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          subtitle: Text(
            '${song.artist} • ${song.album.isEmpty ? 'Single' : song.album}',
            style: const TextStyle(fontSize: 12),
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: () async => _toggleFavoriteSong(song.id),
                icon: Icon(
                  song.isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: song.isFavorite ? Colors.pinkAccent : Colors.grey,
                  size: 20,
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: () async => _toggleDownloadSong(song.id),
                icon: Icon(
                  song.isDownloaded ? Icons.download_done : Icons.download,
                  color: song.isDownloaded ? Colors.green : Colors.grey,
                  size: 20,
                ),
              ),
            ],
          ),
          onTap: () async {
            await Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => SongDetailScreen(
                  song: song,
                  onDownload: () async => _toggleDownloadSong(song.id),
                  onFavoriteToggle: () async => _toggleFavoriteSong(song.id),
                ),
              ),
            );
            if (mounted) setState(() {});
          },
        ),
      ),
    );
  }
}
