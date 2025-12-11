import express from 'express';
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
app.use(helmet());
app.use(express.json({ limit: '10mb' })); // Increased limit for profile pictures (base64)

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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Crypto Trade Analysis API is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
