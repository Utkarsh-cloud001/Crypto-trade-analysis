import { Request, Response } from 'express';
import crypto from 'crypto';
import { Resend } from 'resend';
import User from '../models/User';

// Initialize Resend
// Note: This requires RESEND_API_KEY in .env
const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const htmlMessage = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        if (!process.env.RESEND_API_KEY) {
            console.error('Missing RESEND_API_KEY');
            return res.status(500).json({ message: 'Server misconfiguration: Missing Email API Key.' });
        }

        try {
            const data = await resend.emails.send({
                from: 'Crypto Trade Analysis <' + SENDER_EMAIL + '>',
                to: user.email,
                subject: 'Password Reset Request',
                html: htmlMessage,
            });

            if (data.error) {
                console.error('Resend API Error:', data.error);
                throw new Error(data.error.message);
            }

            console.log('Email sent successfully:', data.data?.id);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error: any) {
            console.error('Email send failed:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                message: 'Email service failed',
                error: error.message
            });
        }
    } catch (error: any) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server Verification Error', error: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.passwordHash = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password reset success',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
