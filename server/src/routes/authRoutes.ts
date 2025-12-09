import express from 'express';
import { registerUser, loginUser, updateUserProfile, deleteAllJournals, deleteUserAccount } from '../controllers/authController';
import { forgotPassword, resetPassword } from '../controllers/passwordController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/profile', protect, updateUserProfile);
router.delete('/journals', protect, deleteAllJournals);
router.delete('/account', protect, deleteUserAccount);

export default router;
