import express from 'express';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import tradeRoutes from './routes/tradeRoutes';
import journalRoutes from './routes/journalRoutes';
import uploadRoutes from './routes/uploadRoutes';
import tagRoutes from './routes/tagRoutes';
import statsRoutes from './routes/statsRoutes';
import featureRoutes from './routes/featureRoutes';
import accountRoutes from './routes/accountRoutes';
import passport from './config/passport';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

import rateLimit from 'express-rate-limit';
import { sanitizeInputs } from './middleware/securityMiddleware';

// ... imports

app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(passport.initialize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    validate: { xForwardedForHeader: false } // Disable validation for Render
});
app.use(limiter);

// Data Sanitization
app.use(sanitizeInputs);

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/accounts', accountRoutes);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Handle 404 for uploads explicitly to prevent HTML response (fixes CORB)
app.use('/uploads', (req, res) => {
    res.status(404).send('Image not found');
});

app.get('/', (req, res) => {
    res.send('Crypto Trade Analysis API is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
