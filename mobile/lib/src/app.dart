import 'package:flutter/material.dart';
import 'features/auth/screens/welcome_screen.dart';

// Global theme notifier so it can be flipped from any screen instantly
final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier(ThemeMode.system);

class HymnifyApp extends StatelessWidget {
  const HymnifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (_, ThemeMode currentMode, __) {
        return MaterialApp(
          title: 'Hymnify',
          debugShowCheckedModeBanner: false,
          themeMode: currentMode,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF6366f1),       // Web Light Primary
              secondary: Color(0xFF06b6d4),     // Web Light Secondary
              surface: Color(0xFFfafafa),       // Web Light bg-page
              onSurface: Color(0xFF111111),     // Web Light text-primary
              surfaceContainerHighest: Color(0xFFffffff), // Card bg
            ),
            scaffoldBackgroundColor: const Color(0xFFfafafa),
            appBarTheme: const AppBarTheme(
              centerTitle: true,
              elevation: 0,
              backgroundColor: Colors.transparent,
              foregroundColor: Color(0xFF111111),
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF818cf8),       // Web Dark Primary
              secondary: Color(0xFF22d3ee),     // Web Dark Secondary
              surface: Color(0xFF111111),       // Web Dark bg-page
              onSurface: Color(0xFFeeeeee),     // Web Dark text-primary
              surfaceContainerHighest: Color(0xFF1a1a1a), // Card bg
            ),
            scaffoldBackgroundColor: const Color(0xFF111111),
            appBarTheme: const AppBarTheme(
              centerTitle: true,
              elevation: 0,
              backgroundColor: Colors.transparent,
              foregroundColor: Color(0xFFeeeeee),
            ),
          ),
          home: const WelcomeScreen(),
        );
      },
    );
  }
}
