import 'dart:convert';

class Song {
  const Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.category,
    required this.scope,
    required this.chorus,
    required this.lyrics,
    required this.numbers,
    this.description = '',
    this.isDownloaded = false,
    this.hasUpdate = false,
  });

  final String id;
  final String title;
  final String artist;
  final String album;
  final String category;
  final String scope; // public | private
  final String chorus;
  final String lyrics;
  final Map<String, dynamic> numbers;
  final String description;
  final bool isDownloaded;
  final bool hasUpdate;

  factory Song.fromApiJson(Map<String, dynamic> json) {
    final songBlock = (json['song'] as Map<String, dynamic>?) ?? <String, dynamic>{};
    return Song(
      id: (json['_id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      artist: (json['artist'] ?? '').toString(),
      album: (json['album'] ?? '').toString(),
      category: (json['category'] ?? '').toString(),
      scope: (json['scope'] ?? 'public').toString(),
      chorus: (songBlock['chorus'] ?? '').toString(),
      lyrics: (json['lyrics'] ?? '').toString(),
      numbers: (songBlock['numbers'] as Map<String, dynamic>?) ?? <String, dynamic>{},
      description: (json['description'] ?? '').toString(),
    );
  }

  factory Song.fromDbJson(Map<String, dynamic> json) {
    Map<String, dynamic> decodedNumbers = {};
    if (json['numbers'] != null && json['numbers'].toString().isNotEmpty) {
      try {
        decodedNumbers = jsonDecode(json['numbers'].toString()) as Map<String, dynamic>;
      } catch (_) {}
    }

    return Song(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      artist: (json['artist'] ?? '').toString(),
      album: (json['album'] ?? '').toString(),
      category: (json['category'] ?? '').toString(),
      scope: (json['scope'] ?? 'public').toString(),
      chorus: (json['chorus'] ?? '').toString(),
      lyrics: (json['lyrics'] ?? '').toString(),
      numbers: decodedNumbers,
      description: (json['description'] ?? '').toString(),
      isDownloaded: true,
    );
  }

  Map<String, Object?> toDbJson() {
    return <String, Object?>{
      'id': id,
      'title': title,
      'artist': artist,
      'album': album,
      'category': category,
      'scope': scope,
      'chorus': chorus,
      'lyrics': lyrics,
      'numbers': jsonEncode(numbers),
      'description': description,
    };
  }

  Song copyWith({
    bool? isDownloaded,
    bool? hasUpdate,
  }) {
    return Song(
      id: id,
      title: title,
      artist: artist,
      album: album,
      category: category,
      scope: scope,
      chorus: chorus,
      lyrics: lyrics,
      numbers: numbers,
      description: description,
      isDownloaded: isDownloaded ?? this.isDownloaded,
      hasUpdate: hasUpdate ?? this.hasUpdate,
    );
  }
}
