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

// Christian Music Database - Pre-curated recommendations
const CHRISTIAN_MUSIC_DB = {
  'christian-hiphop': [
    { title: 'Run to the Battle', artist: 'TONIC', genre: 'Christian Hip Hop', reason: 'Energetic Christian hip hop with powerful message' },
    { title: 'Armor of God', artist: 'KB', genre: 'Christian Hip Hop', reason: 'Inspiring Christian rap about faith' },
    { title: 'Fear Not', artist: 'Trip Lee', genre: 'Christian Hip Hop', reason: 'Uplifting Christian hip hop message' },
    { title: 'Declaration', artist: 'Lecrae', genre: 'Christian Hip Hop', reason: 'Bold Christian hip hop anthem' },
    { title: 'I\'m Alive', artist: 'Skillet', genre: 'Christian Rock/Hip Hop', reason: 'High energy Christian track' },
  ],
  'christian-pop': [
    { title: 'What A Beautiful Name', artist: 'Hillsong Worship', genre: 'Christian Pop', reason: 'Modern uplifting Christian pop' },
    { title: 'Living Hope', artist: 'Phil Wickham', genre: 'Christian Pop', reason: 'Inspiring faith-based pop' },
    { title: 'Goodness of God', artist: 'Jenn Johnson', genre: 'Christian Pop', reason: 'Feel-good Christian pop anthem' },
    { title: 'Believe', artist: 'The Newsboys', genre: 'Christian Pop', reason: 'Energetic Christian pop' },
    { title: 'Oceans', artist: 'Hillsong United', genre: 'Christian Pop', reason: 'Popular modern Christian song' },
  ],
  'christian-indie': [
    { title: 'This Is Amazing Grace', artist: 'Phil Wickham', genre: 'Christian Indie', reason: 'Modern indie Christian worship' },
    { title: 'One Thing', artist: 'Kari Jobe', genre: 'Christian Indie', reason: 'Beautiful indie Christian anthem' },
    { title: 'Jesus Lover of My Soul', artist: 'Bethel Music', genre: 'Christian Indie', reason: 'Intimate indie Christian worship' },
    { title: 'The Call', artist: 'Natalie Grant', genre: 'Christian Indie', reason: 'Indie-pop Christian inspiration' },
    { title: 'Holy Forever', artist: 'Cody Carnes', genre: 'Christian Indie', reason: 'Modern indie worship song' },
  ],
  'electronic-christian': [
    { title: 'Superhuman', artist: 'Skillet', genre: 'Electronic Christian', reason: 'Electronic Christian rock fusion' },
    { title: 'Monster', artist: 'Skillet', genre: 'Electronic Rock', reason: 'Heavy electronic Christian anthem' },
    { title: 'Awaken', artist: 'Skillet', genre: 'Electronic Christian', reason: 'Dynamic electronic Christian track' },
    { title: 'Rise Up', artist: 'Automatic', genre: 'Christian Electronic', reason: 'Modern electronic Christian music' },
    { title: 'The War', artist: 'Skillet', genre: 'Electronic Metal Christian', reason: 'Powerful electronic Christian song' },
  ],
  'worship': [
    { title: 'Great Are You Lord', artist: 'All Sons & Daughters', genre: 'Christian Worship', reason: 'Powerful worship experience' },
    { title: 'Reckless Love', artist: 'Cory Asbury', genre: 'Christian Worship', reason: 'Emotional worship anthem' },
    { title: 'No Longer Slaves', artist: 'Jonathan David & Melissa Helser', genre: 'Christian Worship', reason: 'Inspirational worship song' },
    { title: 'Ever Be', artist: 'Justin Moore & Jenn Johnson', genre: 'Christian Worship', reason: 'Beautiful worship melody' },
    { title: 'Endless Alleluia', artist: 'Brandon Chrisler', genre: 'Christian Worship', reason: 'Joyful Christian worship' },
  ],
};

export class RecommendationService {
  private apiServerUrl: string;

  constructor() {
    // Your local GPT4All server on port 4891
    this.apiServerUrl = process.env.GPT4ALL_API_URL || 'http://localhost:4891';
    console.log(`[RECOMMENDATION] Initialized with API URL: ${this.apiServerUrl}`);
  }

  /**
   * Parse listening stats from submission content
   * Extracts genres, artists, and moods from the input
   */
  private parseListeningStats(content: string): {
    genres: string[];
    moods: string[];
    artists: string[];
  } {
    // This is a simple parser - in production, you'd analyze the screenshot or Spotify link more deeply
    const genreKeywords: { [key: string]: string[] } = {
      pop: ['pop', 'taylor swift', 'ariana grande', 'ed sheeran'],
      hiphop: ['rap', 'hip-hop', 'kendrick', 'drake', 'kanye'],
      rock: ['rock', 'alternative', 'indie', 'the weeknd', 'arctic monkeys'],
      electronic: ['edm', 'electronic', 'house', 'techno', 'daft punk'],
      jazz: ['jazz', 'miles davis', 'john coltrane'],
      classical: ['classical', 'orchestra', 'beethoven', 'mozart'],
      country: ['country', 'taylor', 'dolly', 'johnny cash'],
      rnb: ['r&b', 'soul', 'usher', 'chris brown', 'jhené aiko'],
    };

    const moodKeywords: { [key: string]: string[] } = {
      energetic: ['workout', 'energetic', 'upbeat', 'party', 'gym'],
      chill: ['chill', 'relax', 'lofi', 'ambient', 'peaceful'],
      sad: ['sad', 'melancholy', 'breakup', 'emotional', 'dark'],
      happy: ['happy', 'uplifting', 'joyful', 'fun', 'positive'],
      focus: ['focus', 'study', 'work', 'concentration', 'productive'],
    };

    const lowerContent = content.toLowerCase();
    const genres: string[] = [];
    const moods: string[] = [];

    // Detect genres
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some((kw) => lowerContent.includes(kw))) {
        genres.push(genre);
      }
    }

    // Detect moods
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((kw) => lowerContent.includes(kw))) {
        moods.push(mood);
      }
    }

    // Default if nothing detected
    if (genres.length === 0) genres.push('pop', 'indie');
    if (moods.length === 0) moods.push('chill');

    return {
      genres: [...new Set(genres)],
      moods: [...new Set(moods)],
      artists: this.extractArtists(lowerContent),
    };
  }

  private extractArtists(content: string): string[] {
    // Simple artist extraction - look for common patterns
    const artists = new Set<string>();
    const commonArtists = [
      'taylor swift',
      'the weeknd',
      'drake',
      'ariana grande',
      'ed sheeran',
      'billie eilish',
      'dua lipa',
      'bad bunny',
      'kanye west',
      'travis scott',
      'harry styles',
      'olivia rodrigo',
      'juice wrld',
      'the 1975',
      'arctic monkeys',
    ];

    commonArtists.forEach((artist) => {
      if (content.includes(artist.toLowerCase())) {
        artists.add(artist);
      }
    });

    return Array.from(artists).slice(0, 3); // Top 3 artists
  }

  /**
   * Call the GPT4All server to generate recommendations
   */
  async callLocalLLM(prompt: string): Promise<string> {
    // No longer using GPT4All - using rule-based recommendations instead
    return '';
  }

  /**
   * Generate song recommendations based on genres and moods - RULE-BASED (FAST)
   */
  async generateRecommendations(
    submissionId: string,
    content: string
  ): Promise<RecommendationResult> {
    try {
      console.log(`[RECOMMENDATION] Generating recommendations for ${submissionId}`);

      // Parse the submission content
      const { genres, moods, artists } = this.parseListeningStats(content);
      console.log(`[RECOMMENDATION] Detected genres: ${genres.join(', ')}`);
      console.log(`[RECOMMENDATION] Detected moods: ${moods.join(', ')}`);
      console.log(`[RECOMMENDATION] Detected artists: ${artists.join(', ')}`);

      // Get songs from our Christian music database
      const playlist1 = this.buildPlaylist('Christian Hip Hop Mix', genres, moods[0] || 'energetic');
      const playlist2 = this.buildPlaylist('Worship & Inspiration', genres, moods[1] || 'peaceful');

      const result: RecommendationResult = {
        submissionId,
        recommendations: [playlist1, playlist2],
        genres: ['Christian Hip Hop', 'Christian Pop', 'Christian Indie', 'Electronic'],
        topMoods: moods.length > 0 ? moods : ['energetic', 'peaceful'],
        reasoning: `Curated Christian music recommendations based on your listening preferences (${genres.join(', ')})`,
        generatedAt: new Date().toISOString(),
      };

      console.log(`[RECOMMENDATION] Successfully generated ${result.recommendations.length} playlists`);
      return result;
    } catch (error: any) {
      console.error('[RECOMMENDATION] Error generating recommendations:', error.message);
      return this.generateFallbackResult(submissionId);
    }
  }

  /**
   * Build a playlist from our Christian music database
   */
  private buildPlaylist(playlistName: string, genres: string[], mood: string): PlaylistRecommendation {
    let selectedSongs: Song[] = [];

    // Select songs based on detected genres
    if (genres.includes('hiphop') || genres.includes('rap')) {
      selectedSongs = [...(CHRISTIAN_MUSIC_DB['christian-hiphop'] || [])];
    } else if (genres.includes('pop')) {
      selectedSongs = [...(CHRISTIAN_MUSIC_DB['christian-pop'] || [])];
    } else if (genres.includes('indie')) {
      selectedSongs = [...(CHRISTIAN_MUSIC_DB['christian-indie'] || [])];
    } else if (genres.includes('electronic')) {
      selectedSongs = [...(CHRISTIAN_MUSIC_DB['electronic-christian'] || [])];
    }

    // Add worship songs if no songs selected
    if (selectedSongs.length === 0) {
      selectedSongs = [...(CHRISTIAN_MUSIC_DB['worship'] || [])];
    }

    // Mix in other Christian genres for variety
    const otherGenres = Object.keys(CHRISTIAN_MUSIC_DB).filter(
      key => !selectedSongs.some(song => CHRISTIAN_MUSIC_DB[key as keyof typeof CHRISTIAN_MUSIC_DB].includes(song))
    );

    for (const genre of otherGenres) {
      const genreSongs = CHRISTIAN_MUSIC_DB[genre as keyof typeof CHRISTIAN_MUSIC_DB] || [];
      selectedSongs.push(...genreSongs.slice(0, 2));
    }

    // Return playlist with 5 songs
    return {
      name: playlistName,
      description: `A curated selection of Christian music matching your ${mood} mood`,
      songs: selectedSongs.slice(0, 5),
      mood: mood,
      confidence: 0.95,
    };
  }

  /**
   * Parse LLM response that might not be perfect JSON
   */
  private parseFallbackResponse(response: string): any {
    try {
      // If response contains JSON, extract it
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Ignore parse errors
    }

    // Return default structure
    return JSON.parse(this.generateFallbackRecommendations());
  }

  /**
   * Generate hardcoded fallback recommendations
   */
  private generateFallbackRecommendations(): string {
    return JSON.stringify({
      playlists: [
        {
          name: 'Discover Weekly Mix',
          description: 'Fresh tracks tailored to your taste',
          mood: 'energetic',
          confidence: 0.85,
          songs: [
            {
              title: 'Blinding Lights',
              artist: 'The Weeknd',
              genre: 'synthwave',
              reason: 'Matches your energetic mood and electronic production style',
            },
            {
              title: 'As It Was',
              artist: 'Harry Styles',
              genre: 'pop',
              reason: 'Upbeat pop with modern production',
            },
            {
              title: 'Anti-Hero',
              artist: 'Taylor Swift',
              genre: 'pop',
              reason: 'Popular artist in your listening history',
            },
            {
              title: 'Starboy',
              artist: 'The Weeknd ft. Daft Punk',
              genre: 'electronic',
              reason: 'Electronic influence with strong beat',
            },
            {
              title: '505',
              artist: 'Arctic Monkeys',
              genre: 'indie',
              reason: 'Indie alternative for variety',
            },
          ],
        },
        {
          name: 'Deep Focus Sessions',
          description: 'Ambient and lo-fi for concentration',
          mood: 'chill',
          confidence: 0.9,
          songs: [
            {
              title: 'Good as Hell',
              artist: 'Lizzo',
              genre: 'pop',
              reason: 'Smooth and calming',
            },
            {
              title: 'Night Shift',
              artist: 'Lucy Spraggan',
              genre: 'indie-pop',
              reason: 'Perfect for focused work sessions',
            },
            {
              title: 'Electric Feel',
              artist: 'MGMT',
              genre: 'electronic',
              reason: 'Chill electronic vibes',
            },
            {
              title: 'Iris',
              artist: 'The Goo Goo Dolls',
              genre: 'rock',
              reason: 'Timeless and relaxing',
            },
            {
              title: 'Lomo',
              artist: 'Carla Morrison',
              genre: 'indie',
              reason: 'Soothing indie track',
            },
          ],
        },
      ],
      genres: ['pop', 'indie', 'electronic'],
      moods: ['energetic', 'chill'],
      reasoning:
        'Generated based on detected listening patterns. Mix of energetic pop/electronic and chill indie tracks.',
    });
  }

  /**
   * Generate fallback result without LLM
   */
  private generateFallbackResult(submissionId: string): RecommendationResult {
    const fallbackData = JSON.parse(this.generateFallbackRecommendations());

    return {
      submissionId,
      recommendations: fallbackData.playlists,
      genres: fallbackData.genres,
      topMoods: fallbackData.moods,
      reasoning: fallbackData.reasoning,
      generatedAt: new Date().toISOString(),
    };
  }
}

export default new RecommendationService();
