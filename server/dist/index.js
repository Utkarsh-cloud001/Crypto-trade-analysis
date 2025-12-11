"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tradeRoutes_1 = __importDefault(require("./routes/tradeRoutes"));
const journalRoutes_1 = __importDefault(require("./routes/journalRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const featureRoutes_1 = __importDefault(require("./routes/featureRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Trust proxy for Render (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const securityMiddleware_1 = require("./middleware/securityMiddleware");
// ... imports
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    validate: { xForwardedForHeader: false } // Disable validation for Render
});
app.use(limiter);
// Data Sanitization
app.use(securityMiddleware_1.sanitizeInputs);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/trades', tradeRoutes_1.default);
app.use('/api/journal', journalRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/tags', tagRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
app.use('/api/features', featureRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
    res.send('Crypto Trade Analysis API is running');
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
