import 'package:flutter/material.dart';
import '../../songs/screens/song_list_screen.dart';
import '../../songs/screens/offline_songs_screen.dart';
import '../../../app.dart'; // To access themeNotifier

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // For Light mode, we use the beautiful Indigo -> Cyan gradient.
    // For Dark mode, we use a sleek deep dark background gradient.
    final gradientColors = isDark
        ? [const Color(0xFF1a1a1a), const Color(0xFF111111)]
        : [Theme.of(context).colorScheme.primary, Theme.of(context).colorScheme.secondary];

    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradientColors,
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Theme Toggle Button
              Positioned(
                top: 16,
                right: 16,
                child: IconButton(
                  icon: Icon(
                    isDark ? Icons.light_mode : Icons.dark_mode,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    themeNotifier.value = isDark ? ThemeMode.light : ThemeMode.dark;
                  },
                ),
              ),
              
              // Main Content
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 40.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Spacer(),
                    const Icon(
                      Icons.music_note,
                      size: 100,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Hymnify',
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Your spiritual companion in song.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                    const Spacer(),
                    
                    // Button 1: Explore Public Songs
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SongListScreen()),
                          );
                        },
                        icon: const Icon(Icons.explore),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Theme.of(context).colorScheme.primary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                        ),
                        label: const Text(
                          'Explore Public Songs',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Button 2: Offline/Downloaded Songs
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const OfflineSongsScreen()),
                          );
                        },
                        icon: const Icon(Icons.folder_special),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white.withOpacity(0.2),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        label: const Text(
                          'My Offline Hymns',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Button 3: Private Access / Login
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Private login functionality coming soon!'),
                              backgroundColor: Colors.white24,
                            ),
                          );
                        },
                        icon: const Icon(Icons.lock_outline),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white, width: 2),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          foregroundColor: Colors.white,
                        ),
                        label: const Text(
                          'Login for Private Songs',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        'Learn more about Hymnify',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          decoration: TextDecoration.underline,
                          decorationColor: Colors.white.withOpacity(0.7),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
