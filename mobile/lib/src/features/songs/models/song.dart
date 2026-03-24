class Song {
  const Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.category,
    required this.scope,
    required this.chorus,
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
      description: (json['description'] ?? '').toString(),
    );
  }

  factory Song.fromDbJson(Map<String, dynamic> json) {
    return Song(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      artist: (json['artist'] ?? '').toString(),
      album: (json['album'] ?? '').toString(),
      category: (json['category'] ?? '').toString(),
      scope: (json['scope'] ?? 'public').toString(),
      chorus: (json['chorus'] ?? '').toString(),
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
      description: description,
      isDownloaded: isDownloaded ?? this.isDownloaded,
      hasUpdate: hasUpdate ?? this.hasUpdate,
    );
  }
}
