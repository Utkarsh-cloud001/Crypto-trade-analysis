import express from 'express';
import { getFeatures, createFeature, voteFeature, unvoteFeature } from '../controllers/featureController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getFeatures).post(protect, createFeature);
router.post('/:id/vote', protect, voteFeature);
router.delete('/:id/vote', protect, unvoteFeature);

export default router;
