import { Request, Response } from 'express';
import Tag from '../models/Tag';
import { z } from 'zod';

const tagSchema = z.object({
    name: z.string().min(1).max(50),
    category: z.string().min(1).max(50),
    description: z.string().max(200).optional(),
});

// Get all tags for the authenticated user
export const getTags = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const tags = await Tag.find({ user: req.user._id as any }).sort({ createdAt: -1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Create a new tag
export const createTag = async (req: Request, res: Response) => {
    try {
        const validation = tagSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const { name, category, description } = validation.data;

        // Check if tag with same name already exists for this user
        const existingTag = await Tag.findOne({ user: req.user._id as any, name });
        if (existingTag) {
            res.status(400).json({ message: 'Tag with this name already exists' });
            return;
        }

        const tag = await Tag.create({
            name,
            category,
            description,
            user: req.user._id as any,
        });

        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update a tag
export const updateTag = async (req: Request, res: Response) => {
    try {
        const validation = tagSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const tag = await Tag.findOne({ _id: req.params.id, user: req.user._id as any });

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        tag.name = req.body.name || tag.name;
        tag.category = req.body.category || tag.category;
        tag.description = req.body.description !== undefined ? req.body.description : tag.description;

        const updatedTag = await tag.save();
        res.json(updatedTag);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const tag = await Tag.findOne({ _id: req.params.id, user: req.user._id as any });

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        await tag.deleteOne();
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
