import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { databases, storage, ID, DATABASE_ID, COLLECTIONS } from '../utils/appwrite';

const uploadDir = path.join(process.cwd(), 'backend', 'uploads');

const storageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const uploadMiddleware = multer({ storage: storageConfig });

export const uploadStatsScreenshot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Uploading screenshot, file path:', req.file.path);
    console.log('Database:', DATABASE_ID, 'Collection:', COLLECTIONS.SUBMISSIONS);

    // Create submission document in Appwrite
    const submission = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      ID.unique(),
      {
        type: 'screenshot',
        imageUrl: req.file.path,
        topArtists: [],
        topTracks: [],
        genres: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    console.log('Screenshot submission created:', submission.$id);
    return res.status(201).json({ submission });
  } catch (err: any) {
    console.error('Error in uploadStatsScreenshot:', err.message || err);
    console.error('Full error:', err);
    return res.status(500).json({ 
      error: 'Failed to upload screenshot',
      details: err.message || String(err)
    });
  }
};

export const submitStatsLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spotifyLink } = req.body;

    if (!spotifyLink) {
      return res.status(400).json({ error: 'spotifyLink is required' });
    }

    console.log('[STATS] Creating submission with link:', spotifyLink);
    console.log('[STATS] Database:', DATABASE_ID, 'Collection:', COLLECTIONS.SUBMISSIONS);

    // Set timeout to prevent hanging
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Appwrite request timeout after 10s')), 10000)
    );

    // Create submission document in Appwrite
    const createPromise = databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      ID.unique(),
      {
        type: 'spotify-link',
        spotifyLink,
        topArtists: [],
        topTracks: [],
        genres: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    const submission = (await Promise.race([createPromise, timeout])) as any;

    console.log('[STATS] Submission created:', submission.$id);
    return res.status(201).json({ submission });
  } catch (err: any) {
    console.error('[ERROR] Error in submitStatsLink:', err.message || err);
    console.error('[ERROR] Full error:', err);
    return res.status(500).json({ 
      error: 'Failed to create submission',
      details: err.message || String(err)
    });
  }
};

export const getSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    console.log('Fetching submission:', id);

    const submission = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      id
    );

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    return res.json({ submission });
  } catch (err: any) {
    console.error('Error in getSubmission:', err.message || err);
    console.error('Full error:', err);
    return res.status(500).json({ 
      error: 'Failed to fetch submission',
      details: err.message || String(err)
    });
  }
};
