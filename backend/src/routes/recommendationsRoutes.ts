import express, { Request, Response } from 'express';
import ReccoBeatsService from '../services/reccoBeatsService';
import { SpotifyDataService } from '../services/spotifyDataService';
import { Client, Databases } from 'node-appwrite';

const router = express.Router();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

/**
 * POST /api/recommendations/:submissionId
 * Generate recommendations for a submission
 * Supports both Spotify links (parsed with SpotAPI) and text descriptions
 */
router.post('/:submissionId', async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Missing content in request body',
      });
    }

    console.log(`[API] Generating recommendations for submission: ${submissionId}`);
    console.log(`[API] Content: ${content}`);

    let recommendationContent = content;
    let spotifyData: any = null;
    let spotifyTracksCount = 0;

    // Check if content is a Spotify link
    if (content.includes('spotify.com') || content.includes('spotify:')) {
      console.log(`[API] Detected Spotify link, parsing with SpotAPI...`);
      try {
        const tracks = await SpotifyDataService.parseSpotifyLink(content);
        
        if (tracks && tracks.length > 0) {
          spotifyTracksCount = tracks.length;
          console.log(`[API] Successfully extracted ${tracks.length} tracks from Spotify link`);
          
          // Extract audio features and genres from the tracks
          spotifyData = SpotifyDataService.extractAudioFeatures(tracks);
          
          // Create recommendation content from track data
          const artistsStr = spotifyData.artists.join(', ');
          const genresStr = spotifyData.recommendations.join(', ');
          recommendationContent = `Music similar to: ${artistsStr}. Genres: ${genresStr}. Popularity: ${spotifyData.avgPopularity}/100`;
          
          console.log(`[API] Extracted genres: ${genresStr}`);
          console.log(`[API] Top artists: ${artistsStr}`);
        } else {
          console.warn(`[API] No tracks extracted from Spotify link, using original content`);
        }
      } catch (spotifyError: any) {
        console.warn(`[API] SpotAPI parsing failed:`, spotifyError.message);
        console.log(`[API] Falling back to using original content for recommendations`);
      }
    }

    // Generate recommendations using ReccoBeats service
    const recommendations = await ReccoBeatsService.generateRecommendations(
      submissionId,
      recommendationContent
    );

    console.log(`[API] Recommendations generated successfully`);

    // Optional: Store recommendations in Appwrite
    try {
      const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';
      if (databaseId) {
        const result = await databases.createDocument(
          databaseId,
          'recommendations', // Collection ID
          'unique()', // Auto-generate document ID
          {
            submissionId: submissionId,
            provider: 'reccobeats-api-spotapi',
            recommendations: JSON.stringify(recommendations.recommendations),
            reasoning: recommendations.reasoning,
            confidence: recommendations.recommendations[0]?.confidence || 0.95,
            generatedAt: recommendations.generatedAt,
            spotifyTracksCount: spotifyTracksCount,
          }
        );

        console.log(`[API] Recommendations stored in Appwrite: ${result.$id}`);
      }
    } catch (dbError: any) {
      console.warn(`[API] Could not store recommendations in Appwrite:`, dbError.message);
      // Continue anyway - we'll still return the recommendations
    }

    // Return recommendations to frontend
    res.status(200).json({
      success: true,
      submissionId,
      recommendations: recommendations.recommendations,
      genres: recommendations.genres,
      moods: recommendations.topMoods,
      reasoning: recommendations.reasoning,
      generatedAt: recommendations.generatedAt,
      spotifyData: spotifyData ? { // Include Spotify data if available
        artists: spotifyData.artists,
        genres: spotifyData.genres,
        avgPopularity: spotifyData.avgPopularity,
      } : null,
    });
  } catch (error: any) {
    console.error('[API] Error generating recommendations:', error.message);
    console.error('[API] Stack:', error.stack);

    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/recommendations/:submissionId
 * Get stored recommendations for a submission
 */
router.get('/:submissionId', async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;

    console.log(`[API] Fetching recommendations for: ${submissionId}`);

    const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';
    if (!databaseId) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Query recommendations by submissionId
    const results = await databases.listDocuments(databaseId, 'recommendations', [
      // Simple filter - in real Appwrite, use proper queries
    ]);

    // Filter by submissionId manually (Appwrite SDK limitation)
    const recommendation = results.documents.find(
      (doc: any) => doc.submissionId === submissionId
    );

    if (!recommendation) {
      return res.status(404).json({
        error: 'Recommendations not found for this submission',
      });
    }

    res.status(200).json({
      success: true,
      submissionId,
      recommendation: {
        provider: recommendation.provider,
        recommendations: JSON.parse(recommendation.recommendations),
        reasoning: recommendation.reasoning,
        confidence: recommendation.confidence,
        generatedAt: recommendation.generatedAt,
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching recommendations:', error.message);

    res.status(500).json({
      error: 'Failed to fetch recommendations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
