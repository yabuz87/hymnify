import 'package:flutter/material.dart';
import 'features/songs/screens/song_list_screen.dart';

class HymnifyApp extends StatelessWidget {
  const HymnifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hymnify',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3D5AFE)),
        useMaterial3: true,
      ),
      home: const SongListScreen(),
    );
  }
}
