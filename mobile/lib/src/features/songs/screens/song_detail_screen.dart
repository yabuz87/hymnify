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

  void _shareLyrics(BuildContext context) {
    final buffer = StringBuffer();
    
    final formattedTitle = song.title.replaceAll(RegExp(r',\s*'), '\n').trim();
    final formattedArtist = song.artist.replaceAll(RegExp(r',\s*'), '\n').trim();
    final formattedAlbum = song.album.replaceAll(RegExp(r',\s*'), '\n').trim();

    buffer.writeln('$formattedTitle - $formattedArtist');
    if (formattedAlbum.isNotEmpty) buffer.writeln('Album: $formattedAlbum');
    buffer.writeln();

    final sortedNumbers = song.numbers.entries.toList()
      ..sort((a, b) => (int.tryParse(a.key) ?? 0).compareTo(int.tryParse(b.key) ?? 0));

    if (sortedNumbers.isNotEmpty) {
      if (song.chorus.isNotEmpty) {
        buffer.writeln('[Chorus]');
        buffer.writeln(song.chorus.replaceAll(RegExp(r',\s*'), '\n').trim());
        buffer.writeln();
      }
      for (final entry in sortedNumbers) {
        buffer.writeln('Verse ${entry.key}.');
        buffer.writeln(entry.value.toString().replaceAll(RegExp(r',\s*'), '\n').trim());
        buffer.writeln();
      }
    } else if (song.lyrics.isNotEmpty) {
      if (song.chorus.isNotEmpty) {
        buffer.writeln('[Chorus]');
        buffer.writeln(song.chorus.replaceAll(RegExp(r',\s*'), '\n').trim());
        buffer.writeln();
      }
      buffer.writeln(song.lyrics.replaceAll(RegExp(r',\s*'), '\n').trim());
    } else if (song.chorus.isNotEmpty) {
      buffer.writeln('[Chorus]');
      buffer.writeln(song.chorus.replaceAll(RegExp(r',\s*'), '\n').trim());
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
            'Verse $number',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.8),
                ),
          ),
          const SizedBox(height: 6),
          Text(
            text.replaceAll(RegExp(r',\s*'), '\n').trim(),
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
              'Chorus',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: Theme.of(context).colorScheme.primary.withOpacity(0.8),
                  ),
            ),
            const SizedBox(height: 6),
            Text(
              song.chorus.replaceAll(RegExp(r',\s*'), '\n').trim(),
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
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            Text(
              song.title.replaceAll(RegExp(r',\s*'), '\n').trim(),
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              song.artist.replaceAll(RegExp(r',\s*'), '\n').trim(),
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            if (song.album.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                'Album: ${song.album.replaceAll(RegExp(r',\s*'), '\n').trim()}',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
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
                song.lyrics.replaceAll(RegExp(r',\s*'), '\n').trim(),
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6),
              ),
            ] else ...[
              // Fallback if neither numbers nor lyrics exist but there's a chorus
              _buildChorus(context),
            ],

            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
