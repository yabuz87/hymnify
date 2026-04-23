import '../models/song.dart';
import 'package:dio/dio.dart';
import 'package:path/path.dart' as p;
import 'package:sqflite/sqflite.dart';

class SongRepository {
  SongRepository()
      : _dio = Dio(
          BaseOptions(
            baseUrl: 'https://hymnify.onrender.com',
            connectTimeout: const Duration(seconds: 10),
            receiveTimeout: const Duration(seconds: 20),
          ),
        );

  final Dio _dio;
  Database? _db;

  Future<Database> _database() async {
    if (_db != null) return _db!;

    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, 'hymnify_mobile.db');

    _db = await openDatabase(
      path,
      version: 4,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE offline_songs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            album TEXT,
            category TEXT,
            scope TEXT,
            chorus TEXT,
            lyrics TEXT,
            numbers TEXT,
            uploaded_at TEXT,
            description TEXT,
            is_favorite INTEGER NOT NULL DEFAULT 0
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute('DROP TABLE IF EXISTS offline_songs');
          await db.execute('''
            CREATE TABLE offline_songs (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              artist TEXT NOT NULL,
              album TEXT,
              category TEXT,
              scope TEXT,
              chorus TEXT,
              lyrics TEXT,
              numbers TEXT,
              description TEXT
            )
          ''');
        }
        if (oldVersion < 3) {
          await db.execute('ALTER TABLE offline_songs ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0');
        }
        if (oldVersion < 4) {
          await db.execute('ALTER TABLE offline_songs ADD COLUMN uploaded_at TEXT');
        }
      },
    );
    return _db!;
  }

  Future<List<Song>> fetchPublicSongs() async {
    final response = await _dio.get('/song/all');
    final list = (response.data['publicSongs'] as List<dynamic>? ?? <dynamic>[]);
    return list
        .whereType<Map<String, dynamic>>()
        .map(Song.fromApiJson)
        .toList();
  }

  Future<Set<String>> getOfflineSongIds() async {
    final db = await _database();
    final rows = await db.query('offline_songs', columns: <String>['id']);
    return rows.map((row) => (row['id'] ?? '').toString()).toSet();
  }

  Future<Set<String>> getFavoriteSongIds() async {
    final db = await _database();
    final rows = await db.query('offline_songs', columns: <String>['id'], where: 'is_favorite = ?', whereArgs: [1]);
    return rows.map((row) => (row['id'] ?? '').toString()).toSet();
  }

  Future<void> toggleFavoriteOffline(Song song) async {
    final db = await _database();
    final newFavStatus = !song.isFavorite;
    await db.insert(
      'offline_songs',
      song.copyWith(isFavorite: newFavStatus).toDbJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> saveSongOffline(Song song) async {
    final db = await _database();
    await db.insert(
      'offline_songs',
      song.toDbJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Song>> fetchOfflineSongs() async {
    final db = await _database();
    final rows = await db.query('offline_songs', orderBy: 'title ASC');
    return rows.map((row) => Song.fromDbJson(row)).toList();
  }

  Future<void> deleteOfflineSong(String id) async {
    final db = await _database();
    await db.delete(
      'offline_songs',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<Song>> loginAndFetchPrivateSongs({
    required String churchName,
    required String choirName,
    required String location,
    required String accessingPassword,
  }) async {
    try {
      final response = await _dio.post(
        '/client/login',
        data: {
          'churchName': churchName,
          'choirName': choirName,
          'location': location,
          'accessingPassword': accessingPassword,
        },
      );
      
      final list = (response.data['songs'] as List<dynamic>? ?? <dynamic>[]);
      return list
          .whereType<Map<String, dynamic>>()
          .map(Song.fromApiJson)
          .toList();
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        final message = e.response?.data['message'] ?? 'Login failed';
        throw Exception(message);
      }
      throw Exception('Network error. Please try again.');
    }
  }
}
