import { Router } from 'express';
import {
  uploadMiddleware,
  uploadStatsScreenshot,
  submitStatsLink,
  getSubmission,
} from '../controllers/statsController';

const router = Router();

router.post('/upload', uploadMiddleware.single('image'), uploadStatsScreenshot);
router.post('/link', submitStatsLink);
router.get('/:id', getSubmission);

export default router;
