import { spawn } from 'child_process';
import axios from 'axios';

interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  artists: string[];
  album: string;
  duration: number;
  image?: string;
  popularity?: number;
}

interface ParsedSpotifyData {
  type: 'track' | 'playlist' | 'album';
  id: string;
  tracks: SpotifyTrack[];
  track_count?: number;
}

export class SpotifyDataService {
  /**
   * Parse a Spotify link using SpotAPI and extract track data
   * Calls the Python SpotAPI service to get real Spotify data
   */
  static async parseSpotifyLink(url: string): Promise<SpotifyTrack[]> {
    return new Promise((resolve, reject) => {
      try {
        // Call Python script to parse Spotify link using SpotAPI
        const pythonProcess = spawn('python', [
          '-c',
          `
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from spotifyLinkParser import SpotifyLinkParser
import json

try:
  result = SpotifyLinkParser.parse_spotify_link('${url}')
  if result:
    print(json.dumps({
      'success': True,
      'type': result.get('type'),
      'id': result.get('id'),
      'tracks': result.get('tracks', []),
      'track_count': len(result.get('tracks', []))
    }))
  else:
    print(json.dumps({'success': False, 'error': 'Could not parse URL'}))
except Exception as e:
  print(json.dumps({'success': False, 'error': str(e)}))
`
        ]);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`[SPOTAPI] Python error: ${errorOutput}`);
            reject(new Error(`SpotAPI process failed: ${errorOutput}`));
            return;
          }

          try {
            const result = JSON.parse(output);
            if (result.success && result.tracks) {
              console.log(`[SPOTAPI] Successfully parsed Spotify link: ${result.type} with ${result.tracks.length} tracks`);
              resolve(result.tracks);
            } else {
              console.warn(`[SPOTAPI] Parse failed: ${result.error}`);
              resolve([]); // Return empty array on parse failure
            }
          } catch (parseError) {
            console.error(`[SPOTAPI] JSON parse error: ${parseError}`);
            resolve([]); // Return empty array on parse error
          }
        });
      } catch (error) {
        console.error(`[SPOTAPI] Error spawning Python process:`, error);
        resolve([]); // Return empty array on process error
      }
    });
  }

  /**
   * Search for tracks using SpotAPI
   * Useful for finding reference tracks when playlist parsing fails
   */
  static async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    return new Promise((resolve) => {
      try {
        const pythonProcess = spawn('python', [
          '-c',
          `
import sys
sys.path.insert(0, 'backend/src/services')
from spotifyLinkParser import SpotifyLinkParser
import json

try:
  tracks = SpotifyLinkParser.search_tracks('${query}', limit=${limit})
  print(json.dumps({
    'success': True,
    'tracks': tracks,
    'count': len(tracks)
  }))
except Exception as e:
  print(json.dumps({'success': False, 'error': str(e), 'tracks': []}))
`
        ]);

        let output = '';

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.on('close', () => {
          try {
            const result = JSON.parse(output);
            if (result.success) {
              console.log(`[SPOTAPI] Found ${result.count} tracks for query: "${query}"`);
              resolve(result.tracks || []);
            } else {
              console.warn(`[SPOTAPI] Search failed: ${result.error}`);
              resolve([]);
            }
          } catch (parseError) {
            console.error(`[SPOTAPI] JSON parse error:`, parseError);
            resolve([]);
          }
        });
      } catch (error) {
        console.error(`[SPOTAPI] Error spawning Python process:`, error);
        resolve([]);
      }
    });
  }

  /**
   * Extract audio features from parsed tracks to use as seed data
   * Analyzes track genres and moods to provide better recommendations
   */
  static extractAudioFeatures(tracks: SpotifyTrack[]): {
    genres: string[];
    artists: string[];
    avgPopularity: number;
    recommendations: string[];
  } {
    if (!tracks || tracks.length === 0) {
      return {
        genres: [],
        artists: [],
        avgPopularity: 0,
        recommendations: []
      };
    }

    const artists = [...new Set(tracks.flatMap(t => t.artists || []))];
    const avgPopularity = Math.round(
      tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length
    );

    // Simple genre detection based on track titles and artists
    const genreKeywords = {
      'christian': ['christian', 'gospel', 'worship', 'jesus', 'god', 'faith', 'hymn', 'spiritual'],
      'pop': ['pop', 'pop hit', 'chart', 'love', 'heart'],
      'hiphop': ['hip hop', 'rap', 'beat', 'flow'],
      'indie': ['indie', 'alternative', 'indie rock'],
      'electronic': ['electronic', 'edm', 'synth', 'electronic dance'],
    };

    const detectedGenres: string[] = [];
    const contentStr = tracks.map(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase()).join(' ');

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some(kw => contentStr.includes(kw))) {
        detectedGenres.push(genre);
      }
    }

    return {
      genres: detectedGenres.length > 0 ? detectedGenres : ['pop'],
      artists: artists.slice(0, 5),
      avgPopularity,
      recommendations: detectedGenres
    };
  }
}
