import { Request, Response } from 'express';
import Feature from '../models/Feature';
import { z } from 'zod';

const featureSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    category: z.enum(['feature', 'announcement']).optional(),
});

// Get all features (sorted by votes)
export const getFeatures = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const filter: any = {};
        if (category) filter.category = category;

        const features = await Feature.find(filter)
            .sort({ votes: -1, createdAt: -1 })
            .populate('createdBy', 'name email');

        res.json(features);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Create a new feature request
export const createFeature = async (req: Request, res: Response) => {
    try {
        const validation = featureSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        const { title, description, category } = validation.data;

        const feature = await Feature.create({
            title,
            description,
            category: category || 'feature',
            createdBy: req.user!._id,
        });

        res.status(201).json(feature);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Vote for a feature
export const voteFeature = async (req: Request, res: Response) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            res.status(404).json({ message: 'Feature not found' });
            return;
        }

        const userId = req.user!._id.toString();
        const hasVoted = feature.voters.some(voter => voter.toString() === userId);

        if (hasVoted) {
            res.status(400).json({ message: 'Already voted for this feature' });
            return;
        }

        feature.voters.push(req.user!._id);
        feature.votes += 1;
        await feature.save();

        res.json(feature);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Remove vote from a feature
export const unvoteFeature = async (req: Request, res: Response) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            res.status(404).json({ message: 'Feature not found' });
            return;
        }

        const userId = req.user!._id.toString();
        const voterIndex = feature.voters.findIndex(voter => voter.toString() === userId);

        if (voterIndex === -1) {
            res.status(400).json({ message: 'Have not voted for this feature' });
            return;
        }

        feature.voters.splice(voterIndex, 1);
        feature.votes -= 1;
        await feature.save();

        res.json(feature);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
