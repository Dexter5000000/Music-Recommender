# Christian Music Archive Integration

## Overview

The Spotify Music Recommender now integrates with the **Christian Music Archive** (https://www.christianmusicarchive.com) to provide personalized recommendations for Christian music artists alongside Spotify recommendations.

## Features

### 1. Christian Artist Discovery
- Automatically suggests Christian artists based on detected music genres
- Fetches data from Christian Music Archive's comprehensive artist database
- Supports genres: Alternative, Indie, Pop, Rock, Hip-Hop, Folk, Country, and more

### 2. API Endpoints

#### Get Christian Artists by Genre
```
GET /api/christian-artists/:genre
```

**Parameters:**
- `genre` (path): Music genre (e.g., 'alternative', 'indie', 'pop', 'rock', 'hip-hop')

**Response:**
```json
{
  "success": true,
  "genre": "alternative",
  "artists": [
    {
      "name": "Emery",
      "genre": "Christian Alternative",
      "url": "https://www.christianmusicarchive.com/artist/emery"
    }
  ],
  "count": 8
}
```

#### Get Recommendations for Detected Genre
```
GET /api/christian-artists/recommendations/:detectedGenre
```

**Parameters:**
- `detectedGenre` (path): The genre detected from user's music

**Response:**
```json
{
  "success": true,
  "detectedGenre": "alternative",
  "recommendedArtists": ["Emery", "Underoath", "Anberlin"],
  "message": "Here are some Christian alternative artists you might enjoy"
}
```

### 3. Integration with Recommendations

When generating recommendations (POST /api/recommendations/:submissionId), the system now includes Christian artist suggestions:

```json
{
  "success": true,
  "recommendations": [...],
  "genres": ["pop"],
  "moods": ["uplifting"],
  "christianArtists": {
    "artists": ["Relient K", "Newsboys", "The Afters"],
    "message": "Here are some Christian artists with similar styles"
  }
}
```

## Supported Genres

The integration maps common music genres to Christian Music Archive categories:

- **Alternative/Indie**: Modern/Alt. Rock
- **Pop**: Pop
- **Rock**: Rock
- **Hip-Hop/Rap**: Hip-Hop
- **Folk**: Folk
- **Americana**: Americana
- **Country**: Country
- **Gospel**: Gospel

## Frontend Integration

### ChristianArtistSuggestions Component

Display Christian artist suggestions in your UI:

```tsx
import ChristianArtistSuggestions from './components/ChristianArtistSuggestions';

<ChristianArtistSuggestions
  artists={["Emery", "Underoath", "Anberlin"]}
  message="Here are some Christian artists with similar styles"
/>
```

### Usage in Recommendations Page

```tsx
const response = await api.post(`/api/recommendations/${submissionId}`, {
  content: spotifyLink
});

// Display Christian artists if available
if (response.data.christianArtists?.artists.length > 0) {
  <ChristianArtistSuggestions 
    artists={response.data.christianArtists.artists}
    message={response.data.christianArtists.message}
  />
}
```

## Error Handling

The service includes built-in fallback data for common genres when the Christian Music Archive fetch fails:

- Falls back to cached artist lists for: alternative, indie, pop, rock
- Returns empty array if no fallback data available
- Continues recommendations flow without blocking

## Data Sources

- **Primary**: Christian Music Archive web scraping (real-time)
- **Secondary**: Built-in fallback cache for reliability

## Technical Details

### Service: `christianMusicArchiveService.ts`

**Methods:**
- `getArtistsByGenre(genre)` - Fetch artists from CMA by genre
- `getChristianRecommendations(detectedGenre)` - Get top 5 artist recommendations
- `parseArtistsFromHTML(html)` - Parse HTML response for artist data
- `getFallbackArtists(genre)` - Return cached fallback artists

### Route: `christianArtistsRoutes.ts`

**Endpoints:**
- `GET /:genre` - Get artists by genre
- `GET /recommendations/:detectedGenre` - Get artist recommendations

## Future Enhancements

- [ ] Caching layer for frequent genre requests
- [ ] Direct Spotify API integration for Christian artist playlists
- [ ] User preferences for Christian music discovery
- [ ] Christian artist of the week feature
- [ ] Genre-specific filtering (worship, hip-hop, indie, etc.)
- [ ] Integration with other Christian music databases
- [ ] Playlist generation from Christian Music Archive data

## Configuration

No additional configuration needed. The service uses default fallback data and includes error handling.

To customize fallback artists, edit `getFallbackArtists()` in `christianMusicArchiveService.ts`.

## Support

For issues or suggestions:
- Check Christian Music Archive: https://www.christianmusicarchive.com
- Submit issues to the project repository
