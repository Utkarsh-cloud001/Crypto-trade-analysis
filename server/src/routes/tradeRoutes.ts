import express from 'express';
import {
    createTrade,
    getTrades,
    getTradeById,
    updateTrade,
    deleteTrade,
    getTradeStats,
} from '../controllers/tradeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createTrade).get(protect, getTrades);
router.get('/stats', protect, getTradeStats);
router.route('/:id').get(protect, getTradeById).put(protect, updateTrade).delete(protect, deleteTrade);

export default router;
