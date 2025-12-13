import { Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Setup Nodemailer transporter
const smtpPort = Number(process.env.SMTP_PORT) || 587;

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

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

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset Request',
                html: message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            console.error('Email send failed:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            // For bad setup, we might want to log the token to be helpful in dev
            if (process.env.NODE_ENV === 'development') {
                console.log('Reset URL:', resetUrl);
                return res.status(200).json({ success: true, data: 'Email failed to send, but here is the link (DEV ONLY)', link: resetUrl });
            }

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Verification Error', error });
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
