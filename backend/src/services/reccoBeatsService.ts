import axios from 'axios';

interface Song {
  title: string;
  artist: string;
  genre: string;
  reason: string;
}

interface PlaylistRecommendation {
  name: string;
  description: string;
  songs: Song[];
  mood: string;
  confidence: number;
}

interface RecommendationResult {
  submissionId: string;
  recommendations: PlaylistRecommendation[];
  genres: string[];
  topMoods: string[];
  reasoning: string;
  generatedAt: string;
}

// Universal music seed tracks for recommendations
// Using widely recognized Spotify IDs that ReccoBeats accepts
const UNIVERSAL_SEED_TRACKS = {
  'hiphop': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley - Never Gonna Give You Up (widely indexed)
    '6ZFbXIJkuI1dVNWvzJzown', // Drake - God's Plan
    '11dFghVu5yppv5zH0NK0O8', // Kanye West - Jesus Walks
  ],
  'pop': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley - Never Gonna Give You Up
    '6ZFbXIJkuI1dVNWvzJzown', // Drake - God's Plan
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran - Shape of You
  ],
  'indie': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'electronic': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'rock': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'rnb': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'jazz': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'country': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'latin': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
};

// Christian music seed tracks as secondary option
const CHRISTIAN_SEED_TRACKS = {
  'hiphop': [
    '11dFghVu5yppv5zH0NK0O8', // Kanye West - Jesus Walks
    '0diylW9XH59g4izYmUQP6N', // Jay-Z - Izzo/H.O.V.A.
    '3qm84nBvXcG82nrF3K9DZx', // Tupac - California Love
  ],
  'pop': [
    '0VjIjW4GlUZAMYd2vXMwbG', // Blinding Lights - The Weeknd
    '11dFghVu5yppv5zH0NK0O8', // Jesus Walks - Kanye West
    '7qiZfU4dY1lsylvNFoYL2E', // Shape of You - Ed Sheeran
  ],
  'indie': [
    '3n3Ppam7vgaVa1iaRUc9Lp', // Arctic Monkeys - Do I Wanna Know?
    '7xXXneU3XVc8sJj0Ent0Zm', // The Strokes - Last Nite
  ],
  'electronic': [
    '2takcwgfAJjIX0IBnVrCu7', // Daft Punk - Get Lucky
    '0VjIjW4GlUZAMYd2vXMwbG', // Calvin Harris - How Deep Is Your Love
  ]
};

export class ReccoBeatsService {
  private apiUrl = 'https://api.reccobeats.com/v1';
  private seedTracks = UNIVERSAL_SEED_TRACKS;
  private christianFallback = CHRISTIAN_SEED_TRACKS;

  /**
   * Extract Spotify IDs from playlist URL
   */
  private extractSpotifyId(url: string): string | null {
    const patterns = [
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify:playlist:([a-zA-Z0-9]+)/,
      /spotify:track:([a-zA-Z0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Get track recommendations from ReccoBeats API
   */
  async getTrackRecommendations(
    seedIds: string[],
    audioFeatures?: any
  ): Promise<any[]> {
    try {
      // ReccoBeats API expects comma-separated seeds string
      const seedsParam = seedIds.slice(0, 5).join(',');

      const params: any = {
        seeds: seedsParam,
        size: 10,
      };

      // Add audio feature targets for Christian music
      if (audioFeatures) {
        // High valence for uplifting Christian music
        params.valence = Math.min(0.85, audioFeatures.valence || 0.75);
        // Moderate to high energy for engaging music
        params.energy = Math.min(0.85, audioFeatures.energy || 0.65);
        // Match danceability for hip hop recommendations
        if (audioFeatures.danceability) {
          params.danceability = Math.min(0.85, audioFeatures.danceability);
        }
      }

      console.log(`[RECCOBEATS] Requesting recommendations with seeds:`, seedsParam);
      console.log(`[RECCOBEATS] Query params:`, params);

      const response = await axios.get(`${this.apiUrl}/track/recommendation`, {
        params,
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });

      console.log(`[RECCOBEATS] API Response status:`, response.status);
      console.log(`[RECCOBEATS] API Response data:`, JSON.stringify(response.data).substring(0, 500));

      // Handle different response formats
      const tracks = response.data.content || response.data.tracks || response.data || [];
      console.log(`[RECCOBEATS] Extracted ${tracks.length} tracks from response`);
      
      return Array.isArray(tracks) ? tracks : [];
    } catch (error: any) {
      console.error('[RECCOBEATS] Error getting recommendations:');
      console.error('[RECCOBEATS] Status:', error.response?.status);
      console.error('[RECCOBEATS] Message:', error.message);
      console.error('[RECCOBEATS] Data:', error.response?.data);
      return [];
    }
  }

  /**
   * Get track details
   */
  async getTrackDetails(trackIds: string[]): Promise<any[]> {
    try {
      if (trackIds.length === 0) return [];

      const response = await axios.get(`${this.apiUrl}/track`, {
        params: { ids: trackIds.slice(0, 40).join(',') }, // Max 40 tracks
        timeout: 5000,
      });

      return response.data.content || response.data || [];
    } catch (error: any) {
      console.log('[RECCOBEATS] Could not get track details:', error.message);
      return [];
    }
  }

  /**
   * Generate recommendations based on submission
   */
  async generateRecommendations(
    submissionId: string,
    content: string
  ): Promise<RecommendationResult> {
    try {
      console.log(`[RECCOBEATS] Generating recommendations for ${submissionId}`);

      // Detect genre from content
      const genres = this.detectGenres(content);
      const moods = this.detectMoods(content);

      console.log(`[RECCOBEATS] Detected genres: ${genres.join(', ')}`);
      console.log(`[RECCOBEATS] Detected moods: ${moods.join(', ')}`);

      // Get seed tracks for the detected genres
      const seedTracks = this.getSeedTracksForGenres(genres);
      console.log(`[RECCOBEATS] Using seed tracks:`, seedTracks);

      // Create audio feature targets for Christian music characteristics
      const audioFeatureTargets: any = {
        valence: 0.75,  // High positivity/uplifting mood (0.75 out of 1.0)
        energy: 0.65,   // Moderate-high energy for engagement
        danceability: 0.6,  // Reasonably danceable
      };

      // Adjust based on detected mood
      if (moods.includes('melancholic') || moods.includes('reflective')) {
        audioFeatureTargets.valence = 0.4;  // Lower for sad/melancholic
        audioFeatureTargets.energy = 0.5;   // Lower energy for reflection
      }
      if (moods.includes('energetic') || moods.includes('intense')) {
        audioFeatureTargets.energy = 0.75;  // Higher energy
        audioFeatureTargets.danceability = 0.7;
      }
      if (moods.includes('romantic')) {
        audioFeatureTargets.valence = 0.6;  // Moderate for romantic
        audioFeatureTargets.energy = 0.4;   // Lower energy
      }

      // Get recommendations with audio feature targeting
      const recommendations = await this.getTrackRecommendations(seedTracks, audioFeatureTargets);
      console.log(`[RECCOBEATS] Got ${recommendations.length} recommendations from API`);

      // If API returns results, use them; otherwise fallback
      if (recommendations.length > 0) {
        const playlists = this.convertToPlaylists(recommendations, genres, moods);
        
        const result: RecommendationResult = {
          submissionId,
          recommendations: playlists,
          genres,
          topMoods: moods,
          reasoning: `Curated ${genres.join(' and ')} recommendations with ${moods.join(' and ')} characteristics`,
          generatedAt: new Date().toISOString(),
        };

        console.log(`[RECCOBEATS] Successfully generated ${result.recommendations.length} playlists from API`);
        return result;
      } else {
        console.log(`[RECCOBEATS] API returned no results, using fallback`);
        return this.generateFallbackRecommendations(submissionId);
      }
    } catch (error: any) {
      console.error('[RECCOBEATS] Error generating recommendations:', error.message);
      return this.generateFallbackRecommendations(submissionId);
    }
  }

  /**
   * Detect genres from content (universal genre detection)
   */
  private detectGenres(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const genres: string[] = [];

    // Genre detection keywords
    const genrePatterns: { [key: string]: string[] } = {
      'hiphop': ['hiphop', 'hip-hop', 'rap', 'trap'],
      'pop': ['pop', 'mainstream', 'radio'],
      'rock': ['rock', 'alternative', 'indie-rock', 'punk'],
      'indie': ['indie', 'alternative', 'underground'],
      'electronic': ['electronic', 'edm', 'synth', 'house', 'techno', 'dnb'],
      'rnb': ['rnb', 'r&b', 'soul', 'rhythm'],
      'jazz': ['jazz', 'improvisation'],
      'country': ['country', 'americana', 'folk'],
      'latin': ['latin', 'reggaeton', 'cumbia', 'salsa'],
      'metal': ['metal', 'heavy'],
      'reggae': ['reggae', 'dancehall'],
      'afrobeat': ['afrobeat', 'afrobeats', 'african'],
    };

    // Check for genre mentions
    for (const [genre, keywords] of Object.entries(genrePatterns)) {
      if (keywords.some((kw) => lowerContent.includes(kw))) {
        genres.push(genre);
      }
    }

    // Default to pop if no genres detected
    if (genres.length === 0) {
      genres.push('pop');
    }

    return [...new Set(genres)];
  }

  /**
   * Detect moods from content (universal mood detection)
   */
  private detectMoods(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const moodKeywords: { [key: string]: string[] } = {
      energetic: ['workout', 'energetic', 'upbeat', 'party', 'hiphop', 'rap', 'gym', 'dance', 'club'],
      chill: ['chill', 'relax', 'lofi', 'ambient', 'peaceful', 'indie', 'cool', 'zen', 'mellow'],
      reflective: ['think', 'study', 'focus', 'reflect', 'meditate', 'introspect', 'contemplative'],
      uplifting: ['uplifting', 'joy', 'happy', 'positive', 'good', 'feel-good', 'motivational'],
      melancholic: ['sad', 'melancholic', 'emotional', 'depressing', 'moody', 'dark', 'introspective'],
      romantic: ['romantic', 'love', 'date', 'intimate', 'slow'],
      intense: ['intense', 'aggressive', 'hard', 'heavy', 'powerful', 'metal'],
    };

    const moods: string[] = [];

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((kw) => lowerContent.includes(kw))) {
        moods.push(mood);
      }
    }

    if (moods.length === 0) {
      moods.push('uplifting');
    }

    return [...new Set(moods)];
  }

  /**
   * Get seed tracks for genres
   */
  private getSeedTracksForGenres(genres: string[]): string[] {
    const seeds: string[] = [];

    for (const genre of genres) {
      const genreTracks = (this.seedTracks as any)[genre];
      if (genreTracks) {
        seeds.push(...genreTracks);
      }
    }

    // Ensure we have seeds, default to pop
    if (seeds.length === 0) {
      seeds.push(...(this.seedTracks as any)['pop']);
    }

    return seeds.slice(0, 5); // Max 5 seeds for API
  }

  /**
   * Convert API recommendations to playlists
   */
  private convertToPlaylists(
    recommendations: any[],
    genres: string[],
    moods: string[]
  ): PlaylistRecommendation[] {
    if (recommendations.length === 0) {
      console.log('[RECCOBEATS] No recommendations received, using fallback');
      return this.generateFallbackRecommendations('').recommendations;
    }

    console.log('[RECCOBEATS] Converting', recommendations.length, 'recommendations to playlists');

    const songs = recommendations.map((track: any, idx: number) => {
      // Handle ReccoBeats API response format
      const title = track.trackTitle || track.name || 'Unknown Track';
      const artistArray = track.artists || [];
      const artist = Array.isArray(artistArray) 
        ? artistArray.map((a: any) => a.name || a).join(', ')
        : (artistArray.name || artistArray || 'Unknown Artist');
      
      const genreLabel = genres[0]?.replace('-', ' ') || 'Christian';
      const moodLabel = moods[0] || 'uplifting';

      return {
        title,
        artist,
        genre: genreLabel,
        reason: `Recommended for ${moodLabel} ${genreLabel} listening - Track #${idx + 1}`,
      };
    });

    const playlist1: PlaylistRecommendation = {
      name: `${genres[0]?.replace('-', ' ').toUpperCase()} Mix`,
      description: 'Your personalized music picks',
      songs: songs.slice(0, 5),
      mood: moods[0] || 'uplifting',
      confidence: 0.95,
    };

    const playlist2: PlaylistRecommendation = {
      name: `Deep Dive Selection`,
      description: 'Discover more tracks',
      songs: songs.slice(5, 10),
      mood: moods[1] || moods[0] || 'reflective',
      confidence: 0.90,
    };

    return [playlist1, playlist2].filter((p) => p.songs.length > 0);
  }

  /**
   * Fallback recommendations if API fails
   */
  private generateFallbackRecommendations(submissionId: string): RecommendationResult {
    const fallbackSongs = [
      { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Synthwave Pop', reason: 'Popular modern hit' },
      { title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop', reason: 'Catchy pop track' },
      { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', genre: 'Indie Rock', reason: 'Indie anthem' },
      { title: 'Get Lucky', artist: 'Daft Punk', genre: 'Electronic', reason: 'Electronic classic' },
      { title: 'Good as Hell', artist: 'Lizzo', genre: 'Pop', reason: 'Uplifting feel-good track' },
      { title: 'Levitating', artist: 'Dua Lipa', genre: 'Disco Pop', reason: 'Energetic disco-pop' },
      { title: 'Last Nite', artist: 'The Strokes', genre: 'Indie Rock', reason: 'Classic indie rock' },
      { title: 'Midnight City', artist: 'M83', genre: 'Electronic', reason: 'Synth-pop masterpiece' },
    ];

    const playlist1: PlaylistRecommendation = {
      name: 'Music Mix',
      description: 'Handpicked music favorites',
      songs: fallbackSongs.slice(0, 4),
      mood: 'uplifting',
      confidence: 0.85,
    };

    const playlist2: PlaylistRecommendation = {
      name: 'Deep Music Picks',
      description: 'More music recommendations',
      songs: fallbackSongs.slice(4, 8),
      mood: 'reflective',
      confidence: 0.80,
    };

    return {
      submissionId,
      recommendations: [playlist1, playlist2],
      genres: ['pop', 'indie'],
      topMoods: ['uplifting'],
      reasoning: 'Curated music based on your taste',
      generatedAt: new Date().toISOString(),
    };
  }
}

export default new ReccoBeatsService();
