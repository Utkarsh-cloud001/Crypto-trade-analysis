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

app.use(cors());
app.use(helmet());
app.use(express.json());

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
