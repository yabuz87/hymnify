import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../models/song.dart';

class SongDetailScreen extends StatelessWidget {
  const SongDetailScreen({
    super.key, 
    required this.song, 
    required this.onDownload,
    required this.onFavoriteToggle,
  });

  final Song song;
  final Future<void> Function() onDownload;
  final Future<void> Function() onFavoriteToggle;

  String _formatMetadata(String text) {
    return text.replaceAll(RegExp(r',\s*'), '\n').trim();
  }

  void _shareLyrics(BuildContext context) {
    final buffer = StringBuffer();
    
    final formattedTitle = _formatMetadata(song.title);
    final formattedArtist = _formatMetadata(song.artist);
    final formattedAlbum = _formatMetadata(song.album);

    buffer.writeln('$formattedTitle - $formattedArtist');
    if (formattedAlbum.isNotEmpty) buffer.writeln('Album: $formattedAlbum');
    buffer.writeln();

    final sortedNumbers = song.numbers.entries.toList()
      ..sort((a, b) => (int.tryParse(a.key) ?? 0).compareTo(int.tryParse(b.key) ?? 0));

    if (sortedNumbers.isNotEmpty) {
      if (song.chorus.isNotEmpty) {
        buffer.writeln('[Chorus]');
        buffer.writeln(_formatMetadata(song.chorus));
        buffer.writeln();
      }
      for (final entry in sortedNumbers) {
        buffer.writeln('Verse ${entry.key}.');
        buffer.writeln(_formatMetadata(entry.value.toString()));
        buffer.writeln();
      }
    } else if (song.lyrics.isNotEmpty) {
      if (song.chorus.isNotEmpty) {
        buffer.writeln('[Chorus]');
        buffer.writeln(_formatMetadata(song.chorus));
        buffer.writeln();
      }
      buffer.writeln(_formatMetadata(song.lyrics));
    } else if (song.chorus.isNotEmpty) {
      buffer.writeln('[Chorus]');
      buffer.writeln(_formatMetadata(song.chorus));
    }

    buffer.writeln();
    buffer.writeln('Shared via Hymnify');

    Share.share(buffer.toString(), subject: song.title);
  }

  Widget _buildVerse(BuildContext context, String number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _formatMetadata(text),
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  height: 1.8,
                  fontSize: 16,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildChorus(BuildContext context) {
    if (song.chorus.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Container(
        padding: const EdgeInsets.only(left: 16),
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: Theme.of(context).colorScheme.primary,
              width: 4,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _formatMetadata(song.chorus),
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontStyle: FontStyle.italic,
                    height: 1.8,
                    fontSize: 16,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final sortedNumbers = song.numbers.entries.toList()
      ..sort((a, b) => (int.tryParse(a.key) ?? 0).compareTo(int.tryParse(b.key) ?? 0));

    final size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hymn Details'),
        actions: [
          IconButton(
            onPressed: () => _shareLyrics(context),
            icon: const Icon(Icons.share),
            tooltip: 'Share Lyrics',
          ),
          IconButton(
            onPressed: onFavoriteToggle,
            icon: Icon(song.isFavorite ? Icons.favorite : Icons.favorite_border),
            color: song.isFavorite ? Colors.pinkAccent : null,
            tooltip: 'Toggle Favorite',
          ),
          IconButton(
            onPressed: onDownload,
            icon: Icon(song.isDownloaded ? Icons.download_done : Icons.download),
            color: song.isDownloaded ? Colors.green : null,
            tooltip: 'Download for offline',
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: InteractiveViewer(
          minScale: 1.0,
          maxScale: 4.0,
          panEnabled: true,
          scaleEnabled: true,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Section
                Text(
                  _formatMetadata(song.title),
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  _formatMetadata(song.artist),
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                if (song.album.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Album: ${_formatMetadata(song.album)}',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
                if (song.category.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Category: ${_formatMetadata(song.category)}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.7),
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                ],
                if (song.uploadedAt.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    'Uploaded On: ${song.uploadedAt.split('T')[0]}',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Colors.grey,
                          fontStyle: FontStyle.italic,
                        ),
                  ),
                ],
                const Divider(height: 32),
    
                // Content Section
                if (sortedNumbers.isNotEmpty) ...[
                  _buildChorus(context),
                  for (int i = 0; i < sortedNumbers.length; i++) ...[
                    _buildVerse(context, sortedNumbers[i].key, sortedNumbers[i].value.toString()),
                  ],
                ] else if (song.lyrics.isNotEmpty) ...[
                  _buildChorus(context),
                  Text(
                    _formatMetadata(song.lyrics),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6),
                  ),
                ] else ...[
                  _buildChorus(context),
                ],
    
                const SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
