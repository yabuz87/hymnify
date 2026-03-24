import 'package:flutter/material.dart';
import '../models/song.dart';

class SongDetailScreen extends StatelessWidget {
  const SongDetailScreen({super.key, required this.song, required this.onDownload});

  final Song song;
  final Future<void> Function() onDownload;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(song.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(song.artist, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text('Album: ${song.album}'),
            Text('Category: ${song.category}'),
            Text('Scope: ${song.scope}'),
            const SizedBox(height: 16),
            Text('Chorus', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 8),
            Text(song.chorus),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: onDownload,
                icon: Icon(song.isDownloaded ? Icons.system_update_alt : Icons.download),
                label: Text(song.isDownloaded ? 'Update Download' : 'Download for Offline'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
