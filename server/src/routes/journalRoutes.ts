import express from 'express';
import {
    createJournal,
    getJournalEntries,
    getJournalById,
    updateJournal,
    deleteJournal,
} from '../controllers/journalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createJournal).get(protect, getJournalEntries);
router.route('/:id').get(protect, getJournalById).put(protect, updateJournal).delete(protect, deleteJournal);

export default router;
