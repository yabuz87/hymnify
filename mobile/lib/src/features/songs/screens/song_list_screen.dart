import 'package:flutter/material.dart';
import '../data/song_repository.dart';
import '../models/song.dart';
import 'song_detail_screen.dart';

class SongListScreen extends StatefulWidget {
  const SongListScreen({super.key});

  @override
  State<SongListScreen> createState() => _SongListScreenState();
}

class _SongListScreenState extends State<SongListScreen> {
  final SongRepository _repository = SongRepository();
  final TextEditingController _searchController = TextEditingController();

  List<Song> _songs = <Song>[];
  bool _isLoading = true;
  String _query = '';
  String? _errorMessage;

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

      if (!mounted) return;
      setState(() {
        _songs = songs
            .map(
              (song) => offlineIds.contains(song.id)
                  ? song.copyWith(isDownloaded: true)
                  : song,
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

  Future<void> _downloadSong(String id) async {
    Song? target;
    for (final song in _songs) {
      if (song.id == id) {
        target = song;
        break;
      }
    }
    if (target == null) return;

    await _repository.saveSongOffline(target);
    setState(() {
      _songs = _songs
          .map((song) => song.id == id ? song.copyWith(isDownloaded: true, hasUpdate: false) : song)
          .toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Song prepared for offline use.')),
    );
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
        title: const Text('Hymnify Songs'),
        actions: [
          IconButton(
            tooltip: 'Private Access (next)',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Private access flow will be integrated next.')),
              );
            },
            icon: const Icon(Icons.lock_open),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search songs, artist, album',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _query.isEmpty
                    ? null
                    : IconButton(
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _query = '');
                        },
                        icon: const Icon(Icons.clear),
                      ),
                border: const OutlineInputBorder(),
              ),
              onChanged: (value) => setState(() => _query = value.trim()),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _errorMessage != null
                    ? Center(child: Text(_errorMessage!))
                : filtered.isEmpty
                    ? const Center(child: Text('No songs found.'))
                    : ListView.separated(
                        itemCount: filtered.length,
                        separatorBuilder: (_, __) => const Divider(height: 1),
                        itemBuilder: (context, index) {
                          final song = filtered[index];
                          return ListTile(
                            title: Text(song.title),
                            subtitle: Text('${song.artist} • ${song.album}'),
                            trailing: FilledButton.tonalIcon(
                              onPressed: () async => _downloadSong(song.id),
                              icon: Icon(song.isDownloaded ? Icons.download_done : Icons.download),
                              label: Text(song.isDownloaded ? 'Downloaded' : 'Download'),
                            ),
                            onTap: () async {
                              await Navigator.of(context).push(
                                MaterialPageRoute<void>(
                                  builder: (_) => SongDetailScreen(
                                    song: song,
                                    onDownload: () async => _downloadSong(song.id),
                                  ),
                                ),
                              );
                              if (mounted) setState(() {});
                            },
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
