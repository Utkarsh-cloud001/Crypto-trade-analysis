import express from 'express';
import { registerUser, loginUser, updateUserProfile, deleteAllJournals, deleteUserAccount } from '../controllers/authController';
import passport from 'passport';
import { forgotPassword, resetPassword } from '../controllers/passwordController';
import { protect } from '../middleware/authMiddleware';
import { generateToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/profile', protect, updateUserProfile);
router.delete('/journals', protect, deleteAllJournals);
router.delete('/account', protect, deleteUserAccount);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req: any, res) => {
        const token = generateToken(req.user._id);
        const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
    }
);

export default router;
