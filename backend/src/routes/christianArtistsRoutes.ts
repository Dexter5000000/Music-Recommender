import { Router, Request, Response } from 'express';
import christianMusicArchiveService from '../services/christianMusicArchiveService';

const router = Router();

/**
 * GET /api/christian-artists/:genre
 * Get Christian artists by genre from Christian Music Archive
 */
router.get('/:genre', async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;

    console.log(`[API] Fetching Christian artists for genre: ${genre}`);

    const result = await christianMusicArchiveService.getArtistsByGenre(genre);

    res.json({
      success: true,
      genre,
      artists: result.artists,
      count: result.count,
      source: 'Christian Music Archive',
    });
  } catch (error) {
    console.error('[API] Error fetching Christian artists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Christian artists',
    });
  }
});

/**
 * GET /api/christian-artists/recommendations/:detectedGenre
 * Get Christian artist recommendations for a detected music genre
 */
router.get('/recommendations/:detectedGenre', async (req: Request, res: Response) => {
  try {
    const { detectedGenre } = req.params;

    console.log(`[API] Getting Christian recommendations for detected genre: ${detectedGenre}`);

    const artists = await christianMusicArchiveService.getChristianRecommendations(
      detectedGenre,
    );

    res.json({
      success: true,
      detectedGenre,
      recommendedArtists: artists,
      message: `Here are some Christian ${detectedGenre} artists you might enjoy`,
    });
  } catch (error) {
    console.error('[API] Error getting Christian recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Christian recommendations',
    });
  }
});

export default router;
