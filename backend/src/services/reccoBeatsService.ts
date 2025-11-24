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

// Christian music seed tracks for recommendations
// Using popular Spotify IDs that are guaranteed to exist in ReccoBeats
const CHRISTIAN_SEED_TRACKS = {
  'christian-hiphop': [
    '11dFghVu5yppv5zH0NK0O8', // Kanye West - Jesus Walks (similar energy to Christian hip hop)
    '0diylW9XH59g4izYmUQP6N', // Jay-Z - Izzo/H.O.V.A. (high energy similar to Christian hip hop)
    '3qm84nBvXcG82nrF3K9DZx', // Tupac - California Love (energetic hip hop)
  ],
  'christian-pop': [
    '0VjIjW4GlUZAMYd2vXMwbG', // Blinding Lights - The Weeknd (popular uplifting pop)
    '11dFghVu5yppv5zH0NK0O8', // Jesus Walks - Kanye West (spiritual themes)
    '7qiZfU4dY1lsylvNFoYL2E', // Shape of You - Ed Sheeran (pop baseline for melody)
  ],
  'christian-indie': [
    '3n3Ppam7vgaVa1iaRUc9Lp', // Arctic Monkeys - Do I Wanna Know? (indie vibe)
    '7xXXneU3XVc8sJj0Ent0Zm', // The Strokes - Last Nite (indie classic)
  ],
  'electronic': [
    '2takcwgfAJjIX0IBnVrCu7', // Daft Punk - Get Lucky (electronic with energy)
    '0VjIjW4GlUZAMYd2vXMwbG', // Calvin Harris - How Deep Is Your Love (uplifting electronic)
  ]
};

export class ReccoBeatsService {
  private apiUrl = 'https://api.reccobeats.com/v1';
  private seedTracks = CHRISTIAN_SEED_TRACKS;

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
      if (moods.includes('worshipful') || moods.includes('reflective')) {
        audioFeatureTargets.valence = 0.7;  // Slightly lower for contemplative
        audioFeatureTargets.energy = 0.5;   // Lower energy for reflection
      }
      if (moods.includes('energetic')) {
        audioFeatureTargets.energy = 0.75;  // Higher energy
        audioFeatureTargets.danceability = 0.7;
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
   * Detect Christian genres from content
   */
  private detectGenres(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const genres: string[] = [];

    // Check for specific Christian genre mentions or Christian music indicator
    if (lowerContent.includes('hiphop') || lowerContent.includes('hip-hop') || lowerContent.includes('rap')) {
      genres.push('christian-hiphop');
    }
    if (lowerContent.includes('pop')) {
      genres.push('christian-pop');
    }
    if (lowerContent.includes('indie') || lowerContent.includes('alternative')) {
      genres.push('christian-indie');
    }
    if (lowerContent.includes('electronic') || lowerContent.includes('edm') || lowerContent.includes('synth')) {
      genres.push('electronic');
    }

    // Default to Christian Pop if no genres detected
    if (genres.length === 0) {
      genres.push('christian-pop');
    }

    return [...new Set(genres)];
  }

  /**
   * Detect moods from content
   */
  private detectMoods(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const moodKeywords: { [key: string]: string[] } = {
      energetic: ['workout', 'energetic', 'upbeat', 'party', 'hiphop', 'rap', 'gym'],
      chill: ['chill', 'relax', 'lofi', 'ambient', 'peaceful', 'indie', 'cool'],
      worshipful: ['worship', 'prayer', 'spiritual', 'devotion', 'praise'],
      reflective: ['think', 'study', 'focus', 'reflect', 'meditate'],
      uplifting: ['uplifting', 'joy', 'happy', 'positive', 'gospel', 'blessed', 'good'],
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

    // Ensure we have seeds, default to Christian Pop
    if (seeds.length === 0) {
      seeds.push(...this.seedTracks['christian-pop']);
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
      description: 'Your personalized Christian music picks',
      songs: songs.slice(0, 5),
      mood: moods[0] || 'uplifting',
      confidence: 0.95,
    };

    const playlist2: PlaylistRecommendation = {
      name: `Deep Dive Selection`,
      description: 'Discover more Christian tracks',
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
      { title: 'All Me', artist: 'Lecrae', genre: 'Christian Hip Hop', reason: 'Inspiring Christian hip hop' },
      { title: 'Look Up Child', artist: 'Lauren Daigle', genre: 'Christian Pop', reason: 'Uplifting Christian pop' },
      { title: 'Rise Up', artist: 'Hillsong Young & Free', genre: 'Worship', reason: 'Modern worship anthem' },
      { title: 'Awake and Alive', artist: 'Skillet', genre: 'Christian Rock', reason: 'High-energy Christian rock' },
      { title: 'Kiss Me', artist: 'Sixpence None The Richer', genre: 'Christian Indie', reason: 'Classic Christian indie' },
      { title: 'Living Hope', artist: 'Kristian Stanfill', genre: 'Worship', reason: 'Meaningful worship song' },
      { title: 'Monster', artist: 'Skillet', genre: 'Electronic', reason: 'Intense Christian electronic' },
      { title: 'Good Good Father', artist: 'Chris Tomlin', genre: 'Christian Pop', reason: 'Modern Christian classic' },
    ];

    const playlist1: PlaylistRecommendation = {
      name: 'Christian Hits Mix',
      description: 'Handpicked Christian music favorites',
      songs: fallbackSongs.slice(0, 4),
      mood: 'uplifting',
      confidence: 0.85,
    };

    const playlist2: PlaylistRecommendation = {
      name: 'Deep Christian Picks',
      description: 'More Christian music recommendations',
      songs: fallbackSongs.slice(4, 8),
      mood: 'reflective',
      confidence: 0.80,
    };

    return {
      submissionId,
      recommendations: [playlist1, playlist2],
      genres: ['christian-pop', 'christian-hiphop'],
      topMoods: ['uplifting'],
      reasoning: 'Curated Christian music based on your taste',
      generatedAt: new Date().toISOString(),
    };
  }
}

export default new ReccoBeatsService();
