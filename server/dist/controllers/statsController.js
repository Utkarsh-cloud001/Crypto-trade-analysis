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
exports.getStats = void 0;
const Trade_1 = __importDefault(require("../models/Trade"));
// Get comprehensive trading statistics
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;
        // Build date filter
        const dateFilter = { user: userId };
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate)
                dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate)
                dateFilter.createdAt.$lte = new Date(endDate);
        }
        const trades = yield Trade_1.default.find(dateFilter);
        const closedTrades = trades.filter(t => t.status === 'CLOSED' && t.pnl !== undefined);
        if (closedTrades.length === 0) {
            return res.json({
                winRate: 0,
                expectancy: 0,
                profitFactor: 0,
                avgWinHold: 0,
                avgLossHold: 0,
                avgLoss: 0,
                winStreak: 0,
                lossStreak: 0,
                topLoss: 0,
                topWin: 0,
                avgDailyVolume: 0,
                avgSize: 0,
                equityCurve: [],
                performanceByDay: [],
                performanceByHour: [],
            });
        }
        // Calculate basic metrics
        const wins = closedTrades.filter(t => t.pnl > 0);
        const losses = closedTrades.filter(t => t.pnl < 0);
        const winRate = (wins.length / closedTrades.length) * 100;
        const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;
        const expectancy = wins.length > 0 && losses.length > 0
            ? (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss
            : 0;
        const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
        const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
        // Calculate streaks
        let maxWinStreak = 0;
        let maxLossStreak = 0;
        let currentWinStreak = 0;
        let currentLossStreak = 0;
        closedTrades.forEach(trade => {
            if (trade.pnl > 0) {
                currentWinStreak++;
                currentLossStreak = 0;
                maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
            }
            else {
                currentLossStreak++;
                currentWinStreak = 0;
                maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
            }
        });
        // Top win/loss
        const topWin = Math.max(...closedTrades.map(t => t.pnl));
        const topLoss = Math.min(...closedTrades.map(t => t.pnl));
        // Average size
        const avgSize = closedTrades.reduce((sum, t) => sum + t.amount, 0) / closedTrades.length;
        // Equity curve (cumulative PnL over time) - using type assertion for createdAt
        const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        let cumulativePnL = 0;
        const equityCurve = sortedTrades.map(trade => {
            cumulativePnL += trade.pnl;
            return {
                date: trade.createdAt,
                value: cumulativePnL,
            };
        });
        // Performance by day of week
        const dayStats = {};
        closedTrades.forEach(trade => {
            const day = new Date(trade.createdAt).getDay();
            if (!dayStats[day]) {
                dayStats[day] = { wins: 0, losses: 0, pnl: 0 };
            }
            if (trade.pnl > 0)
                dayStats[day].wins++;
            else
                dayStats[day].losses++;
            dayStats[day].pnl += trade.pnl;
        });
        const performanceByDay = Object.keys(dayStats).map(day => ({
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)],
            winRate: dayStats[day].wins / (dayStats[day].wins + dayStats[day].losses),
            pnl: dayStats[day].pnl,
            trades: dayStats[day].wins + dayStats[day].losses,
        }));
        // Performance by hour
        const hourStats = {};
        closedTrades.forEach(trade => {
            const hour = new Date(trade.createdAt).getHours();
            if (!hourStats[hour]) {
                hourStats[hour] = { wins: 0, losses: 0, pnl: 0 };
            }
            if (trade.pnl > 0)
                hourStats[hour].wins++;
            else
                hourStats[hour].losses++;
            hourStats[hour].pnl += trade.pnl;
        });
        const performanceByHour = Object.keys(hourStats).map(hour => ({
            hour: parseInt(hour),
            winRate: hourStats[hour].wins / (hourStats[hour].wins + hourStats[hour].losses),
            pnl: hourStats[hour].pnl,
            trades: hourStats[hour].wins + hourStats[hour].losses,
        }));
        res.json({
            winRate: parseFloat(winRate.toFixed(2)),
            expectancy: parseFloat(expectancy.toFixed(2)),
            profitFactor: parseFloat(profitFactor.toFixed(2)),
            avgWinHold: 0,
            avgLossHold: 0,
            avgLoss: parseFloat((avgLoss * 100).toFixed(2)),
            winStreak: maxWinStreak,
            lossStreak: maxLossStreak,
            topLoss: parseFloat((topLoss * 100).toFixed(2)),
            topWin: parseFloat((topWin * 100).toFixed(2)),
            avgDailyVolume: closedTrades.length,
            avgSize: parseFloat(avgSize.toFixed(2)),
            equityCurve,
            performanceByDay,
            performanceByHour,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getStats = getStats;
