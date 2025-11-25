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
  isChristian?: boolean;
}

// CHRISTIAN MUSIC SEED TRACKS - Using popular Christian artists on Spotify
// These IDs are from well-known Christian music artists
const CHRISTIAN_SEED_TRACKS = {
  'worship': [
    '0U0ldCRmgCqhVvD6ksG63j', // Hillsong UNITED - Oceans (Where Feet May Fail)
    '2DOqBE2xABOJ3Gm8tLT1Qi', // Elevation Worship - Graves Into Gardens
    '1okthpRWE6uOzCyLN29V57', // Chris Tomlin - How Great Is Our God
  ],
  'ccm': [ // Contemporary Christian Music
    '5ChkMS8OtdzJeqyybCc9R5', // TobyMac - I just need U.
    '6naxalmIoLFWR0siv8dnQQ', // for KING & COUNTRY - God Only Knows
    '0TtcpR0K8m2Fj6Q1Bt3Kk1', // Lauren Daigle - You Say
  ],
  'christian-hiphop': [
    '11dFghVu5yppv5zH0NK0O8', // Kanye West - Jesus Walks
    '2B6R4NdlEibLTgw9rDMwQK', // Lecrae - Blessings
    '1Ynqq8W6O4Xc1q8xJGW2Wq', // NF - Let You Down
  ],
  'christian-rock': [
    '0tQ4v2EC3xkAIpVH2QMZME', // Skillet - Monster
    '1XC5kK8MjmPccPKS4IZqN4', // Switchfoot - Dare You to Move
    '0IktbUcnAGrvD0hJkqnq5o', // Newsboys - God's Not Dead
  ],
  'christian-pop': [
    '0TtcpR0K8m2Fj6Q1Bt3Kk1', // Lauren Daigle - You Say
    '6naxalmIoLFWR0siv8dnQQ', // for KING & COUNTRY - God Only Knows
    '1okthpRWE6uOzCyLN29V57', // Chris Tomlin - How Great Is Our God
  ],
  'christian-indie': [
    '3n3Ppam7vgaVa1iaRUc9Lp', // NEEDTOBREATHE style
    '2DOqBE2xABOJ3Gm8tLT1Qi', // Elevation Worship
    '0U0ldCRmgCqhVvD6ksG63j', // Hillsong UNITED
  ],
  'gospel': [
    '5HQVUIKwCEXpe7JIHdNxBX', // Kirk Franklin - Love Theory
    '0TtcpR0K8m2Fj6Q1Bt3Kk1', // Lauren Daigle
    '1okthpRWE6uOzCyLN29V57', // Chris Tomlin
  ],
};

// Universal music seed tracks for non-Christian recommendations
const UNIVERSAL_SEED_TRACKS = {
  'hiphop': [
    '6ZFbXIJkuI1dVNWvzJzown', // Drake - God's Plan
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran - Shape of You
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
  ],
  'pop': [
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran - Shape of You
    '6ZFbXIJkuI1dVNWvzJzown', // Drake - God's Plan
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
  ],
  'indie': [
    '3n3Ppam7vgaVa1iaRUc9Lp', // Arctic Monkeys - Do I Wanna Know?
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
  ],
  'rock': [
    '3n3Ppam7vgaVa1iaRUc9Lp', // Arctic Monkeys
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
  ],
  'electronic': [
    '4uLU6hMCjMI75M1A2tKUQC', // Rick Astley
    '7qiZfU4dY1lsylvNFoYL2E', // Ed Sheeran
    '6ZFbXIJkuI1dVNWvzJzown', // Drake
  ],
};

// List of known Christian artists for detection
const CHRISTIAN_ARTISTS = [
  'hillsong', 'elevation worship', 'bethel music', 'chris tomlin', 'lauren daigle',
  'tobymac', 'for king & country', 'for king and country', 'casting crowns', 'mercyme',
  'lecrae', 'nf', 'andy mineo', 'kb', 'trip lee', 'tedashii', 'reach records',
  'skillet', 'switchfoot', 'newsboys', 'third day', 'needtobreathe',
  'matthew west', 'zach williams', 'cory asbury', 'kari jobe', 'tasha cobbs',
  'kirk franklin', 'israel houghton', 'fred hammond', 'donnie mcclurkin',
  'crowder', 'phil wickham', 'passion', 'jesus culture', 'planetshakers',
  'maverick city music', 'chandler moore', 'naomi raine', 'brandon lake',
  'tauren wells', 'we the kingdom', 'cain', 'anne wilson', 'riley clemmons',
  'dante bowe', 'jonathan mcreynolds', 'travis greene', 'tye tribbett',
  'kanye west', 'chance the rapper', 'sunday service choir', 'donda',
  'emery', 'underoath', 'anberlin', 'relient k', 'demon hunter', 'the devil wears prada',
  'august burns red', 'oh sleeper', 'as i lay dying', 'impending doom',
  'david crowder', 'big daddy weave', 'building 429', 'unspoken', 'sidewalk prophets',
  'colton dixon', 'danny gokey', 'jordin sparks', 'natalie grant',
];

export class ReccoBeatsService {
  private apiUrl = 'https://api.reccobeats.com/v1';

  /**
   * Detect if content is Christian music based on artists and keywords
   */
  private detectChristianMusic(content: string): boolean {
    const lowerContent = content.toLowerCase();
    
    // Check for Christian music keywords
    const christianKeywords = [
      'christian', 'worship', 'gospel', 'praise', 'ccm', 'hillsong', 'bethel',
      'jesus', 'god', 'faith', 'church', 'lord', 'holy', 'spirit', 'prayer',
      'salvation', 'blessed', 'grace', 'amen', 'hallelujah', 'hymn', 'hymns',
      'devotional', 'spiritual', 'ministry', 'christ', 'bible', 'scripture',
    ];
    
    // Check for Christian keywords in content
    for (const keyword of christianKeywords) {
      if (lowerContent.includes(keyword)) {
        console.log(`[RECCOBEATS] Detected Christian keyword: ${keyword}`);
        return true;
      }
    }
    
    // Check for known Christian artists
    for (const artist of CHRISTIAN_ARTISTS) {
      if (lowerContent.includes(artist.toLowerCase())) {
        console.log(`[RECCOBEATS] Detected Christian artist: ${artist}`);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Detect Christian music sub-genre
   */
  private detectChristianGenre(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('worship') || lowerContent.includes('hillsong') || 
        lowerContent.includes('elevation') || lowerContent.includes('bethel')) {
      return 'worship';
    }
    if (lowerContent.includes('gospel') || lowerContent.includes('kirk franklin') ||
        lowerContent.includes('tasha cobbs')) {
      return 'gospel';
    }
    if (lowerContent.includes('lecrae') || lowerContent.includes('nf') || 
        lowerContent.includes('andy mineo') || lowerContent.includes('kb') ||
        lowerContent.includes('hip') || lowerContent.includes('rap')) {
      return 'christian-hiphop';
    }
    if (lowerContent.includes('skillet') || lowerContent.includes('switchfoot') ||
        lowerContent.includes('newsboys') || lowerContent.includes('rock')) {
      return 'christian-rock';
    }
    if (lowerContent.includes('indie') || lowerContent.includes('needtobreathe') ||
        lowerContent.includes('crowder')) {
      return 'christian-indie';
    }
    
    // Default to CCM (Contemporary Christian Music)
    return 'ccm';
  }

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

      // FIRST: Check if this is Christian music
      const isChristian = this.detectChristianMusic(content);
      console.log(`[RECCOBEATS] Is Christian music: ${isChristian}`);

      let genres: string[];
      let moods: string[];
      let seedTracks: string[];

      if (isChristian) {
        // Use Christian-specific genre detection and seeds
        const christianGenre = this.detectChristianGenre(content);
        genres = [christianGenre, 'christian'];
        moods = this.detectMoods(content);
        seedTracks = this.getChristianSeedTracks(christianGenre);
        console.log(`[RECCOBEATS] Christian genre: ${christianGenre}`);
      } else {
        // Use universal genre detection
        genres = this.detectGenres(content);
        moods = this.detectMoods(content);
        seedTracks = this.getUniversalSeedTracks(genres);
      }

      console.log(`[RECCOBEATS] Detected genres: ${genres.join(', ')}`);
      console.log(`[RECCOBEATS] Detected moods: ${moods.join(', ')}`);
      console.log(`[RECCOBEATS] Using seed tracks:`, seedTracks);

      // Create audio feature targets
      const audioFeatureTargets: any = {
        valence: 0.75,  // High positivity/uplifting mood
        energy: 0.65,   // Moderate-high energy
        danceability: 0.6,
      };

      // Adjust based on detected mood
      if (moods.includes('melancholic') || moods.includes('reflective')) {
        audioFeatureTargets.valence = 0.4;
        audioFeatureTargets.energy = 0.5;
      }
      if (moods.includes('energetic') || moods.includes('intense')) {
        audioFeatureTargets.energy = 0.75;
        audioFeatureTargets.danceability = 0.7;
      }

      // Get recommendations with audio feature targeting
      const recommendations = await this.getTrackRecommendations(seedTracks, audioFeatureTargets);
      console.log(`[RECCOBEATS] Got ${recommendations.length} recommendations from API`);

      // If API returns results, use them; otherwise fallback
      if (recommendations.length > 0) {
        const playlists = this.convertToPlaylists(recommendations, genres, moods, isChristian);
        
        const result: RecommendationResult = {
          submissionId,
          recommendations: playlists,
          genres,
          topMoods: moods,
          reasoning: isChristian 
            ? `Curated Christian ${genres[0].replace('-', ' ')} recommendations with ${moods.join(' and ')} vibes`
            : `Curated ${genres.join(' and ')} recommendations with ${moods.join(' and ')} characteristics`,
          generatedAt: new Date().toISOString(),
          isChristian,
        };

        console.log(`[RECCOBEATS] Successfully generated ${result.recommendations.length} playlists from API`);
        return result;
      } else {
        console.log(`[RECCOBEATS] API returned no results, using fallback`);
        return this.generateFallbackRecommendations(submissionId, isChristian);
      }
    } catch (error: any) {
      console.error('[RECCOBEATS] Error generating recommendations:', error.message);
      return this.generateFallbackRecommendations(submissionId, false);
    }
  }

  /**
   * Get Christian seed tracks based on sub-genre
   */
  private getChristianSeedTracks(christianGenre: string): string[] {
    const tracks = (CHRISTIAN_SEED_TRACKS as any)[christianGenre];
    if (tracks && tracks.length > 0) {
      return tracks.slice(0, 5);
    }
    // Default to CCM seeds
    return CHRISTIAN_SEED_TRACKS['ccm'].slice(0, 5);
  }

  /**
   * Get universal seed tracks for non-Christian music
   */
  private getUniversalSeedTracks(genres: string[]): string[] {
    const seeds: string[] = [];

    for (const genre of genres) {
      const genreTracks = (UNIVERSAL_SEED_TRACKS as any)[genre];
      if (genreTracks) {
        seeds.push(...genreTracks);
      }
    }

    // Ensure we have seeds, default to pop
    if (seeds.length === 0) {
      seeds.push(...UNIVERSAL_SEED_TRACKS['pop']);
    }

    return seeds.slice(0, 5);
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
   * Convert API recommendations to playlists
   */
  private convertToPlaylists(
    recommendations: any[],
    genres: string[],
    moods: string[],
    isChristian: boolean = false
  ): PlaylistRecommendation[] {
    if (recommendations.length === 0) {
      console.log('[RECCOBEATS] No recommendations received, using fallback');
      return this.generateFallbackRecommendations('', isChristian).recommendations;
    }

    console.log('[RECCOBEATS] Converting', recommendations.length, 'recommendations to playlists');

    const songs = recommendations.map((track: any, idx: number) => {
      // Handle ReccoBeats API response format
      const title = track.trackTitle || track.name || 'Unknown Track';
      const artistArray = track.artists || [];
      const artist = Array.isArray(artistArray) 
        ? artistArray.map((a: any) => a.name || a).join(', ')
        : (artistArray.name || artistArray || 'Unknown Artist');
      
      const genreLabel = isChristian 
        ? `Christian ${genres[0]?.replace('-', ' ').replace('christian ', '')}` 
        : genres[0]?.replace('-', ' ') || 'Music';
      const moodLabel = moods[0] || 'uplifting';

      return {
        title,
        artist,
        genre: genreLabel,
        reason: isChristian 
          ? `Christian ${moodLabel} music recommendation - Track #${idx + 1}`
          : `Recommended for ${moodLabel} ${genreLabel} listening - Track #${idx + 1}`,
      };
    });

    const playlistName = isChristian 
      ? `Christian ${genres[0]?.replace('christian-', '').replace('-', ' ').toUpperCase()} Mix`
      : `${genres[0]?.replace('-', ' ').toUpperCase()} Mix`;

    const playlist1: PlaylistRecommendation = {
      name: playlistName,
      description: isChristian ? 'Your personalized Christian music picks' : 'Your personalized music picks',
      songs: songs.slice(0, 5),
      mood: moods[0] || 'uplifting',
      confidence: 0.95,
    };

    const playlist2: PlaylistRecommendation = {
      name: isChristian ? 'More Christian Tracks' : 'Deep Dive Selection',
      description: isChristian ? 'Discover more Christian artists' : 'Discover more tracks',
      songs: songs.slice(5, 10),
      mood: moods[1] || moods[0] || 'reflective',
      confidence: 0.90,
    };

    return [playlist1, playlist2].filter((p) => p.songs.length > 0);
  }

  /**
   * Fallback recommendations if API fails - now with Christian music support
   */
  private generateFallbackRecommendations(submissionId: string, isChristian: boolean = false): RecommendationResult {
    
    // CHRISTIAN MUSIC FALLBACK
    if (isChristian) {
      const christianFallbackSongs = [
        { title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong UNITED', genre: 'Christian Worship', reason: 'Powerful worship anthem' },
        { title: 'You Say', artist: 'Lauren Daigle', genre: 'Christian Pop', reason: 'Award-winning Christian pop hit' },
        { title: 'Graves Into Gardens', artist: 'Elevation Worship', genre: 'Christian Worship', reason: 'Uplifting worship song' },
        { title: 'God Only Knows', artist: 'for KING & COUNTRY', genre: 'Christian Pop', reason: 'Inspiring Christian pop' },
        { title: 'How Great Is Our God', artist: 'Chris Tomlin', genre: 'Christian Worship', reason: 'Classic worship song' },
        { title: 'Blessings', artist: 'Lecrae', genre: 'Christian Hip-Hop', reason: 'Faith-based hip-hop' },
        { title: 'Monster', artist: 'Skillet', genre: 'Christian Rock', reason: 'High-energy Christian rock' },
        { title: 'Dare You to Move', artist: 'Switchfoot', genre: 'Christian Rock', reason: 'Alternative Christian rock classic' },
        { title: 'Way Maker', artist: 'Sinach', genre: 'Gospel', reason: 'Global worship anthem' },
        { title: 'Reckless Love', artist: 'Cory Asbury', genre: 'Christian Worship', reason: 'Beautiful worship ballad' },
        { title: 'I just need U.', artist: 'TobyMac', genre: 'Christian Pop', reason: 'Contemporary Christian hit' },
        { title: 'Let You Down', artist: 'NF', genre: 'Christian Hip-Hop', reason: 'Emotional Christian rap' },
      ];

      const playlist1: PlaylistRecommendation = {
        name: 'Christian Worship & Pop Mix',
        description: 'Handpicked Christian music favorites',
        songs: christianFallbackSongs.slice(0, 6),
        mood: 'uplifting',
        confidence: 0.90,
      };

      const playlist2: PlaylistRecommendation = {
        name: 'Christian Hip-Hop & Rock',
        description: 'More Christian music recommendations',
        songs: christianFallbackSongs.slice(6, 12),
        mood: 'energetic',
        confidence: 0.85,
      };

      return {
        submissionId,
        recommendations: [playlist1, playlist2],
        genres: ['christian', 'worship', 'ccm'],
        topMoods: ['uplifting', 'inspirational'],
        reasoning: 'Curated Christian music based on your listening preferences',
        generatedAt: new Date().toISOString(),
        isChristian: true,
      };
    }

    // SECULAR/UNIVERSAL MUSIC FALLBACK
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
      isChristian: false,
    };
  }
}

export default new ReccoBeatsService();
