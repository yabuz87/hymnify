import 'package:flutter/material.dart';
import '../../songs/screens/song_list_screen.dart';
import '../../songs/screens/offline_songs_screen.dart';
import 'client_login_screen.dart';
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
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const ClientLoginScreen()),
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
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (context) => Container(
                            height: MediaQuery.of(context).size.height * 0.85,
                            decoration: BoxDecoration(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                            ),
                            padding: const EdgeInsets.all(24),
                            child: SingleChildScrollView(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Center(
                                    child: Container(
                                      width: 40,
                                      height: 4,
                                      decoration: BoxDecoration(
                                        color: Colors.grey.withOpacity(0.3),
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                  Text(
                                    'About Hymnify',
                                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(context).colorScheme.primary,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'Hymnify is a digital platform dedicated to preserving and spreading spiritual gospel music heritage through modern technology.',
                                    style: TextStyle(fontSize: 16, height: 1.5),
                                  ),
                                  const SizedBox(height: 24),
                                  _buildFeatureItem(
                                    context, 
                                    Icons.library_music, 
                                    'Digital Library', 
                                    'A centralized place for all church choir lyrics.'
                                  ),
                                  _buildFeatureItem(
                                    context, 
                                    Icons.offline_pin, 
                                    'Offline Access', 
                                    'Take your favorite hymns anywhere, even without internet.'
                                  ),
                                  _buildFeatureItem(
                                    context, 
                                    Icons.zoom_in, 
                                    'Custom Viewing', 
                                    'Smooth zoom and formatting for comfortable reading.'
                                  ),

                                  const Divider(height: 40),

                                  Text(
                                    'Contact & Support',
                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Have questions or found a typo? Reach out to us:',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                  const SizedBox(height: 12),
                                  _buildLinkItem(Icons.email_outlined, 'support@hymnify.com'),
                                  _buildLinkItem(Icons.language, 'www.hymnify.vercel.app'),

                                  const Divider(height: 40),

                                  Text(
                                    'Privacy Policy',
                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Your privacy is important to us. Hymnify only stores data locally for offline use. We do not track your personal activities or share your private choir access data with third parties.',
                                    style: TextStyle(fontSize: 14, color: Colors.grey),
                                  ),
                                  const SizedBox(height: 32),
                                  const Center(
                                    child: Text(
                                      'Built with ❤️ for the spiritual community.',
                                      style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey, fontSize: 12),
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                      child: Text(
                        'Learn more about Hymnify',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          decoration: TextDecoration.underline,
                          decorationColor: Colors.white.withOpacity(0.7),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'v1.0.0',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.4),
                        fontSize: 12,
                        fontWeight: FontWeight.w300,
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

  Widget _buildLinkItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.blue),
          const SizedBox(width: 8),
          Text(text, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildFeatureItem(BuildContext context, IconData icon, String title, String description) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Theme.of(context).colorScheme.secondary, size: 28),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  description,
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
