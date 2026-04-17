import 'package:flutter/material.dart';
import '../data/song_repository.dart';
import '../models/song.dart';
import 'song_detail_screen.dart';
import '../../../app.dart';

class OfflineSongsScreen extends StatefulWidget {
  const OfflineSongsScreen({super.key});

  @override
  State<OfflineSongsScreen> createState() => _OfflineSongsScreenState();
}

class _OfflineSongsScreenState extends State<OfflineSongsScreen> {
  final SongRepository _repository = SongRepository();
  final TextEditingController _searchController = TextEditingController();

  List<Song> _songs = <Song>[];
  bool _isLoading = true;
  String _query = '';

  bool _isGroupedByAlbum = false;

  @override
  void initState() {
    super.initState();
    _loadOfflineSongs();
  }

  Future<void> _loadOfflineSongs() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final songs = await _repository.fetchOfflineSongs();
      if (!mounted) return;
      setState(() {
        _songs = songs;
      });
    } catch (_) {
      // Handle db errors silently or show snackbar
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to load local bucket.')),
      );
    } finally {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _removeOfflineSong(Song song) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Offline Hymn?'),
        content: Text('Are you sure you want to remove "${song.title}"?'),
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

    await _repository.deleteOfflineSong(song.id);
    setState(() {
      _songs.removeWhere((s) => s.id == song.id);
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Song removed from offline bucket.')),
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
        title: const Text('My Offline Hymns'),
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
                hintText: 'Search downloaded hymns...',
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
                ? const Center(child: CircularProgressIndicator())
                : Column(
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
                        child: _songs.isEmpty
                            ? Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.folder_off_outlined, size: 80, color: Colors.grey.withOpacity(0.5)),
                                    const SizedBox(height: 16),
                                    Text(
                                      'No songs downloaded yet.',
                                      style: TextStyle(color: Colors.grey[600], fontSize: 18, fontWeight: FontWeight.w500),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Explore logic songs and hit download.',
                                      style: TextStyle(color: Colors.grey[500], fontSize: 14),
                                    ),
                                  ],
                                ),
                              )
                            : filtered.isEmpty
                                ? Center(
                                    child: Text(
                                      'No match found for "$_query"',
                                      style: TextStyle(color: Colors.grey[600], fontSize: 16),
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: Colors.grey.withOpacity(0.1)),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
            child: const Icon(Icons.library_music, size: 20),
          ),
          title: Text(
            song.title,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text('${song.artist} • ${song.album.isEmpty ? 'Single' : song.album}'),
          trailing: IconButton(
            onPressed: () => _removeOfflineSong(song),
            icon: const Icon(Icons.delete_outline, color: Colors.red),
            tooltip: 'Remove from offline bucket',
          ),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => SongDetailScreen(
                  song: song.copyWith(isDownloaded: true),
                  onDownload: () async {
                    await _removeOfflineSong(song);
                    if (mounted) Navigator.of(context).pop();
                  },
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
