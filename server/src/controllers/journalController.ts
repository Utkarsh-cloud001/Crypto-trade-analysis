import { Request, Response } from 'express';
import Journal from '../models/Journal';
import { z } from 'zod';

const journalSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    tags: z.array(z.string()).optional(),
    linkedTrade: z.string().optional(),
    mood: z.enum(['EXCELLENT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE']).optional(),
    images: z.array(z.string()).optional(),
});

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
export const createJournal = async (req: Request, res: Response) => {
    try {
        const validation = journalSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        const { title, content, tags, linkedTrade, mood, images } = validation.data;

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const journal = await Journal.create({
            user: req.user._id as any,
            title,
            content,
            tags,
            linkedTrade,
            mood,
            images,
        } as any);

        res.status(201).json(journal);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get all journal entries for user
// @route   GET /api/journal
// @access  Private
export const getJournalEntries = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const entries = await Journal.find({ user: req.user._id as any })
            .populate('linkedTrade')
            .sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
export const getJournalById = async (req: Request, res: Response) => {
    try {
        const entry = await Journal.findById(req.params.id).populate('linkedTrade');

        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
export const updateJournal = async (req: Request, res: Response) => {
    try {
        const entry = await Journal.findById(req.params.id);

        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const updatedEntry = await Journal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
export const deleteJournal = async (req: Request, res: Response) => {
    try {
        const entry = await Journal.findById(req.params.id);

        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        await Journal.findByIdAndDelete(req.params.id);

        res.json({ message: 'Journal entry deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
