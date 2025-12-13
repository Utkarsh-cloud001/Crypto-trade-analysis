import { Request, Response } from 'express';
import Trade from '../models/Trade';
import { tradeSchema } from '../utils/validation';

import Account from '../models/Account';

// @desc    Create new trade
// @route   POST /api/trades
// @access  Private
export const createTrade = async (req: Request, res: Response) => {
    try {
        const validation = tradeSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        let accountId = req.body.account;
        if (!accountId) {
            const primaryAccount = await Account.findOne({ user: req.user._id as any, isPrimary: true });
            if (primaryAccount) {
                accountId = primaryAccount._id;
            } else {
                const anyAccount = await Account.findOne({ user: req.user._id as any });
                if (anyAccount) accountId = anyAccount._id;
            }
        }

        if (!accountId) {
            const newAccount = await Account.create({
                user: req.user._id as any,
                name: 'Default Account',
                isPrimary: true,
                balance: 0
            });
            accountId = newAccount._id;
        }

        const trade = await Trade.create({
            ...validation.data,
            user: req.user._id as any,
            account: accountId,
        });

        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get all trades for user
// @route   GET /api/trades
// @access  Private
export const getTrades = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const trades = await Trade.find({ user: req.user._id as any }).sort({ entryDate: -1 });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get single trade
// @route   GET /api/trades/:id
// @access  Private
export const getTradeById = async (req: Request, res: Response) => {
    try {
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (trade.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        res.json(trade);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update trade
// @route   PUT /api/trades/:id
// @access  Private
export const updateTrade = async (req: Request, res: Response) => {
    try {
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
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

        const updatedTrade = await Trade.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTrade);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete trade
// @route   DELETE /api/trades/:id
// @access  Private
export const deleteTrade = async (req: Request, res: Response) => {
    try {
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (trade.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        await Trade.findByIdAndDelete(req.params.id);

        res.json({ message: 'Trade deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get trade statistics
// @route   GET /api/trades/stats
// @access  Private
export const getTradeStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const trades = await Trade.find({ user: req.user._id as any });

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
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
