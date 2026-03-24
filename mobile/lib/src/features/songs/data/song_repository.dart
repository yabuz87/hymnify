import '../models/song.dart';
import 'package:dio/dio.dart';
import 'package:path/path.dart' as p;
import 'package:sqflite/sqflite.dart';

class SongRepository {
  SongRepository()
      : _dio = Dio(
          BaseOptions(
            // Replace this with your machine IP when running on emulator/device.
            baseUrl: 'http://10.0.2.2:5000',
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
      version: 1,
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
            description TEXT
          )
        ''');
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
}
