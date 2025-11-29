import express from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTags).post(protect, createTag);
router.route('/:id').put(protect, updateTag).delete(protect, deleteTag);

export default router;
