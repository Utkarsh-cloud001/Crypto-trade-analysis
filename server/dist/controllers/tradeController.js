"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeStats = exports.deleteTrade = exports.updateTrade = exports.getTradeById = exports.getTrades = exports.createTrade = void 0;
const Trade_1 = __importDefault(require("../models/Trade"));
const validation_1 = require("../utils/validation");
const Account_1 = __importDefault(require("../models/Account"));
// @desc    Create new trade
// @route   POST /api/trades
// @access  Private
const createTrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validation_1.tradeSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        let accountId = req.body.account;
        if (!accountId) {
            const primaryAccount = yield Account_1.default.findOne({ user: req.user._id, isPrimary: true });
            if (primaryAccount) {
                accountId = primaryAccount._id;
            }
            else {
                const anyAccount = yield Account_1.default.findOne({ user: req.user._id });
                if (anyAccount)
                    accountId = anyAccount._id;
            }
        }
        if (!accountId) {
            const newAccount = yield Account_1.default.create({
                user: req.user._id,
                name: 'Default Account',
                isPrimary: true,
                balance: 0
            });
            accountId = newAccount._id;
        }
        const trade = yield Trade_1.default.create(Object.assign(Object.assign({}, validation.data), { user: req.user._id, account: accountId }));
        res.status(201).json(trade);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createTrade = createTrade;
// @desc    Get all trades for user
// @route   GET /api/trades
// @access  Private
const getTrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trades = yield Trade_1.default.find({ user: req.user._id }).sort({ entryDate: -1 });
        res.json(trades);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTrades = getTrades;
// @desc    Get single trade
// @route   GET /api/trades/:id
// @access  Private
const getTradeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trade = yield Trade_1.default.findById(req.params.id);
        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }
        if (trade.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        res.json(trade);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTradeById = getTradeById;
// @desc    Update trade
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trade = yield Trade_1.default.findById(req.params.id);
        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }
        if (trade.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        if (req.body.status === 'CLOSED' && req.body.exitPrice) {
            let pnl = trade.type === 'LONG'
                ? (req.body.exitPrice - trade.entryPrice) * trade.amount
                : (trade.entryPrice - req.body.exitPrice) * trade.amount;
            // Subtract fees
            const fees = req.body.fees !== undefined ? req.body.fees : (trade.fees || 0);
            pnl -= fees;
            req.body.pnl = pnl;
            req.body.exitDate = new Date();
        }
        const updatedTrade = yield Trade_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedTrade);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateTrade = updateTrade;
// @desc    Delete trade
// @route   DELETE /api/trades/:id
// @access  Private
const deleteTrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trade = yield Trade_1.default.findById(req.params.id);
        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }
        if (trade.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        yield Trade_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trade deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTrade = deleteTrade;
// @desc    Get trade statistics
// @route   GET /api/trades/stats
// @access  Private
const getTradeStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trades = yield Trade_1.default.find({ user: req.user._id });
        const totalTrades = trades.length;
        const closedTrades = trades.filter((t) => t.status === 'CLOSED');
        const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0);
        const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
        res.json({
            totalTrades,
            closedTrades: closedTrades.length,
            openTrades: totalTrades - closedTrades.length,
            winningTrades: winningTrades.length,
            losingTrades: closedTrades.length - winningTrades.length,
            totalPnL,
            winRate: Math.round(winRate * 100) / 100,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTradeStats = getTradeStats;
