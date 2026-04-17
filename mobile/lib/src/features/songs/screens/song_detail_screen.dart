import 'package:flutter/material.dart';
import '../models/song.dart';

class SongDetailScreen extends StatelessWidget {
  const SongDetailScreen({super.key, required this.song, required this.onDownload});

  final Song song;
  final Future<void> Function() onDownload;

  Widget _buildVerse(BuildContext context, String number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$number.',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text.replaceAll(RegExp(r',\s*'), '\n').trim(),
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChorus(BuildContext context) {
    if (song.chorus.isEmpty) return const SizedBox.shrink();
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.music_note, size: 18, color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 8),
              Text(
                'Chorus',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            song.chorus.replaceAll(RegExp(r',\s*'), '\n').trim(),
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontStyle: FontStyle.italic,
                  height: 1.6,
                ),
          ),
        ],
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
              song.title,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              song.artist,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            if (song.album.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                'Album: ${song.album}',
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
