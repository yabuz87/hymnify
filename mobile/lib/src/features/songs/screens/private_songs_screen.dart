import 'package:flutter/material.dart';
import '../models/song.dart';
import '../data/song_repository.dart';
import 'song_detail_screen.dart';
import '../../../app.dart';

class PrivateSongsScreen extends StatefulWidget {
  final List<Song> initialSongs;
  final String ownerName;

  const PrivateSongsScreen({
    super.key,
    required this.initialSongs,
    required this.ownerName,
  });

  @override
  State<PrivateSongsScreen> createState() => _PrivateSongsScreenState();
}

class _PrivateSongsScreenState extends State<PrivateSongsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final SongRepository _repository = SongRepository();

  late List<Song> _songs;
  String _query = '';
  bool _isGroupedByAlbum = false;

  @override
  void initState() {
    super.initState();
    _songs = List.from(widget.initialSongs);
    _checkOfflineStatus();
  }

  Future<void> _checkOfflineStatus() async {
    // Map offline downloaded statuses to private songs seamlessly
    final offlineIds = await _repository.getOfflineSongIds();
    final favoriteIds = await _repository.getFavoriteSongIds();
    if (!mounted) return;
    setState(() {
      _songs = _songs.map(
        (song) => song.copyWith(
          isDownloaded: offlineIds.contains(song.id),
          isFavorite: favoriteIds.contains(song.id),
        ),
      ).toList();
    });
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
          const SnackBar(content: Text('Song secured for offline viewing.')),
        );
      }
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

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _songs.where((song) {
      final q = _query.toLowerCase();
      return song.title.toLowerCase().contains(q) ||
          song.artist.toLowerCase().contains(q) ||
          song.album.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.ownerName} Hymns'),
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
                hintText: 'Search private hymns, albums...',
                prefixIcon: Icon(Icons.search, color: Theme.of(context).colorScheme.primary),
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
            child: Column(
              children: [
                if (_songs.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: SegmentedButton<bool>(
                      segments: const [
                        ButtonSegment(value: false, icon: Icon(Icons.list), label: Text('By Song')),
                        ButtonSegment(value: true, icon: Icon(Icons.album), label: Text('By Album')),
                      ],
                      selected: {_isGroupedByAlbum},
                      onSelectionChanged: (Set<bool> selection) {
                        setState(() {
                          _isGroupedByAlbum = selection.first;
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
                              Icon(Icons.lock_outline, size: 64, color: Colors.grey.withOpacity(0.5)),
                              const SizedBox(height: 16),
                              Text(
                                _query.isEmpty ? 'No private songs assigned.' : 'No match found for "$_query"',
                                style: TextStyle(color: Colors.grey[600], fontSize: 16),
                              ),
                            ],
                          ),
                        )
                      : _isGroupedByAlbum
                          ? _buildGroupedByAlbum(filtered)
                          : ListView.builder(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              itemCount: filtered.length,
                              itemBuilder: (context, index) {
                                return _buildSongCard(filtered[index]);
                              },
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
            leading: Icon(Icons.album, color: Theme.of(context).colorScheme.primary),
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
            child: Icon(Icons.lock, size: 18, color: Theme.of(context).colorScheme.onPrimaryContainer),
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
                  color: song.isFavorite ? Colors.red : Colors.grey,
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
