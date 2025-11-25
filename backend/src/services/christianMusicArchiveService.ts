import axios from 'axios';

const CMA_BASE_URL = 'https://www.christianmusicarchive.com';

interface ChristianArtist {
  name: string;
  genre: string;
  url: string;
  description?: string;
}

interface ChristianArtistResponse {
  artists: ChristianArtist[];
  genre: string;
  count: number;
}

class ChristianMusicArchiveService {
  /**
   * Fetch Christian artists from Christian Music Archive by genre
   * @param genre - Genre to search (e.g., 'alternative-rock', 'indie', 'pop', 'rock')
   * @returns Promise with array of Christian artists
   */
  async getArtistsByGenre(genre: string): Promise<ChristianArtistResponse> {
    try {
      console.log(`[CMA] Fetching Christian artists for genre: ${genre}`);

      // Map common genre names to CMA genre URLs
      const genreMap: { [key: string]: string } = {
        alternative: 'modern-alt-rock',
        'alt-rock': 'modern-alt-rock',
        'alternative-rock': 'modern-alt-rock',
        indie: 'modern-alt-rock',
        'indie-rock': 'modern-alt-rock',
        pop: 'pop',
        rock: 'rock',
        metal: 'rock',
        'hard-rock': 'rock',
        punk: 'rock',
        'pop-punk': 'rock',
        folk: 'folk',
        americana: 'americana',
        hip: 'hip-hop',
        'hip-hop': 'hip-hop',
        rap: 'hip-hop',
        gospel: 'gospel',
        country: 'country',
      };

      const cmaGenre = genreMap[genre.toLowerCase()] || 'modern-alt-rock';
      const url = `${CMA_BASE_URL}/genre/${cmaGenre}`;

      console.log(`[CMA] Fetching from: ${url}`);

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // Parse HTML to extract artist links and names
      const artists = this.parseArtistsFromHTML(response.data);

      console.log(`[CMA] Successfully fetched ${artists.length} artists`);

      return {
        artists,
        genre: cmaGenre,
        count: artists.length,
      };
    } catch (error) {
      console.error('[CMA] Error fetching artists:', error instanceof Error ? error.message : String(error));

      // Return mock data as fallback
      return this.getFallbackArtists(genre);
    }
  }

  /**
   * Parse artist information from HTML
   */
  private parseArtistsFromHTML(html: string): ChristianArtist[] {
    const artists: ChristianArtist[] = [];

    // Look for artist links in the HTML
    // Pattern: <a href="/artist/artist-name">Artist Name</a>
    const artistPattern = /<a[^>]*href="\/artist\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = artistPattern.exec(html)) !== null) {
      const slug = match[1];
      const name = match[2].trim();

      if (name && name.length > 0 && !name.includes('...')) {
        artists.push({
          name,
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/${slug}`,
        });
      }
    }

    // Remove duplicates
    return Array.from(new Map(artists.map((a) => [a.name, a])).values());
  }

  /**
   * Get fallback artists when API fails
   */
  private getFallbackArtists(genre: string): ChristianArtistResponse {
    const fallbackArtists: { [key: string]: ChristianArtist[] } = {
      alternative: [
        {
          name: 'Emery',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/emery`,
        },
        {
          name: 'Underoath',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/underoath`,
        },
        {
          name: 'Anberlin',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/anberlin`,
        },
        {
          name: 'Demon Hunter',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/demon-hunter`,
        },
        {
          name: 'Skillet',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/skillet`,
        },
        {
          name: 'Building 429',
          genre: 'Christian Rock',
          url: `${CMA_BASE_URL}/artist/building-429`,
        },
        {
          name: 'Audio Adrenaline',
          genre: 'Christian Rock',
          url: `${CMA_BASE_URL}/artist/audio-adrenaline`,
        },
        {
          name: 'Addison Road',
          genre: 'Christian Alternative',
          url: `${CMA_BASE_URL}/artist/addison-road`,
        },
      ],
      indie: [
        {
          name: 'Needtobreathe',
          genre: 'Christian Indie Rock',
          url: `${CMA_BASE_URL}/artist/needtobreathe`,
        },
        {
          name: 'Crowder',
          genre: 'Christian Indie',
          url: `${CMA_BASE_URL}/artist/crowder`,
        },
        {
          name: 'All Sons & Daughters',
          genre: 'Christian Indie Folk',
          url: `${CMA_BASE_URL}/artist/all-sons-daughters`,
        },
        {
          name: 'Tenth Avenue North',
          genre: 'Christian Indie',
          url: `${CMA_BASE_URL}/artist/tenth-avenue-north`,
        },
      ],
      pop: [
        {
          name: 'Relient K',
          genre: 'Christian Pop Punk',
          url: `${CMA_BASE_URL}/artist/relient-k`,
        },
        {
          name: 'Newsboys',
          genre: 'Christian Pop Rock',
          url: `${CMA_BASE_URL}/artist/newsboys`,
        },
        {
          name: 'The Afters',
          genre: 'Christian Pop Rock',
          url: `${CMA_BASE_URL}/artist/the-afters`,
        },
        {
          name: 'Stellar Kart',
          genre: 'Christian Pop Punk',
          url: `${CMA_BASE_URL}/artist/stellar-kart`,
        },
      ],
      rock: [
        {
          name: 'Skillet',
          genre: 'Christian Hard Rock',
          url: `${CMA_BASE_URL}/artist/skillet`,
        },
        {
          name: 'Living Sacrifice',
          genre: 'Christian Metal',
          url: `${CMA_BASE_URL}/artist/living-sacrifice`,
        },
        {
          name: 'Oh, Sleeper',
          genre: 'Christian Metalcore',
          url: `${CMA_BASE_URL}/artist/oh-sleeper`,
        },
        {
          name: 'For Today',
          genre: 'Christian Metalcore',
          url: `${CMA_BASE_URL}/artist/for-today`,
        },
      ],
    };

    const artists = fallbackArtists[genre.toLowerCase()] || fallbackArtists['alternative'];

    console.log(`[CMA] Using fallback artists for genre: ${genre}`);

    return {
      artists,
      genre,
      count: artists.length,
    };
  }

  /**
   * Get Christian artist recommendations based on a genre
   */
  async getChristianRecommendations(detectedGenre: string): Promise<string[]> {
    try {
      const response = await this.getArtistsByGenre(detectedGenre);

      // Return top 5 artist names as recommendations
      return response.artists.slice(0, 5).map((a) => a.name);
    } catch (error) {
      console.error('[CMA] Error getting recommendations:', error);
      return [];
    }
  }
}

export default new ChristianMusicArchiveService();
