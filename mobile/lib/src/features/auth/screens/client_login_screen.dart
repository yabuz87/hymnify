import 'package:flutter/material.dart';
import '../../songs/data/song_repository.dart';
import '../../songs/screens/private_songs_screen.dart';

class ClientLoginScreen extends StatefulWidget {
  const ClientLoginScreen({super.key});

  @override
  State<ClientLoginScreen> createState() => _ClientLoginScreenState();
}

class _ClientLoginScreenState extends State<ClientLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _churchNameController = TextEditingController();
  final _choirNameController = TextEditingController();
  final _locationController = TextEditingController();
  final _passwordController = TextEditingController();
  
  final SongRepository _repository = SongRepository();
  bool _isLoading = false;
  bool _obscurePassword = true;

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final songs = await _repository.loginAndFetchPrivateSongs(
        churchName: _churchNameController.text.trim(),
        choirName: _choirNameController.text.trim(),
        location: _locationController.text.trim(),
        accessingPassword: _passwordController.text,
      );

      if (!mounted) return;
      
      // Successfully authenticated & fetched private songs.
      // Push directly to PrivateSongsScreen, passing the dynamically fetched dataset!
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => PrivateSongsScreen(
            initialSongs: songs,
            ownerName: _choirNameController.text.trim(),
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceAll('Exception: ', '')),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _churchNameController.dispose();
    _choirNameController.dispose();
    _locationController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Access Private Hymns'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              Icon(
                Icons.lock_person,
                size: 80,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 24),
              Text(
                'Choir Login',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Enter your credentials to unlock your private catalogue.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 48),

              // Fields
              TextFormField(
                controller: _churchNameController,
                textInputAction: TextInputAction.next,
                decoration: InputDecoration(
                  labelText: 'Church Name',
                  prefixIcon: const Icon(Icons.church),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 16),
              
              TextFormField(
                controller: _choirNameController,
                textInputAction: TextInputAction.next,
                decoration: InputDecoration(
                  labelText: 'Choir Name',
                  prefixIcon: const Icon(Icons.group),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _locationController,
                textInputAction: TextInputAction.next,
                decoration: InputDecoration(
                  labelText: 'Location',
                  prefixIcon: const Icon(Icons.location_on),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _passwordController,
                textInputAction: TextInputAction.done,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: 'Access Password',
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onFieldSubmitted: (_) => _handleLogin(),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 40),

              // Submit
              SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Theme.of(context).colorScheme.onPrimary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isLoading
                      ? SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Theme.of(context).colorScheme.onPrimary,
                          ),
                        )
                      : const Text(
                          'Unlock Songs',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
