import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Journal from '../models/Journal';
import Trade from '../models/Trade';
import Tag from '../models/Tag';
import { registerSchema, loginSchema } from '../utils/validation';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        const { name, email, password } = validation.data;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Password hashing is handled in User model pre-save hook
        // We pass 'password' to passwordHash field, the hook will hash it
        // Wait, the hook hashes 'passwordHash'. So we should assign password to passwordHash initially?
        // Actually, standard practice is to pass plain password and let hook hash it.
        // But my model has 'passwordHash'. Let's adjust the model usage.

        // Correction: The model expects 'passwordHash'. 
        // If I pass plain password to 'passwordHash', the hook will hash it.

        const user = await User.create({
            name,
            email,
            passwordHash: password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user!._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.passwordHash = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id.toString()),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete all journal entries for the user
export const deleteAllJournals = async (req: Request, res: Response) => {
    try {
        const result = await Journal.deleteMany({ user: req.user!._id });
        res.json({ message: `Deleted ${result.deletedCount} journal entries` });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete user account and all associated data
export const deleteUserAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;

        // Delete all user data
        await Promise.all([
            Journal.deleteMany({ user: userId }),
            Trade.deleteMany({ user: userId }),
            Tag.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId),
        ]);

        res.json({ message: 'Account and all data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
