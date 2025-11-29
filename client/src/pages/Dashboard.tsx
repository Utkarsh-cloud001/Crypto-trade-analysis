import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, PieChart, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';
import TradeHeatmap from '../components/TradeHeatmap';
import AnalyticsCharts from '../components/AnalyticsCharts';

interface Trade {
    _id: string;
    pair: string;
    type: 'LONG' | 'SHORT';
    entryPrice: number;
    exitPrice?: number;
    amount: number;
    leverage: number;
    status: 'OPEN' | 'CLOSED';
    pnl?: number;
    entryDate: string;
    exitDate?: string;
}

const Dashboard = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState({
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        openTrades: 0,
    });

    useEffect(() => {
        fetchTrades();
        fetchStats();
    }, []);

    const fetchTrades = async () => {
        try {
            const res = await api.get('/trades');
            setTrades(res.data);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/trades/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const statCards = [
        {
            title: 'Total Trades',
            value: stats.totalTrades,
            icon: Activity,
            color: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-400',
        },
        {
            title: 'Win Rate',
            value: `${stats.winRate.toFixed(1)}%`,
            icon: PieChart,
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-400',
        },
        {
            title: 'Total P&L',
            value: `$${stats.totalPnL.toFixed(2)}`,
            icon: stats.totalPnL >= 0 ? TrendingUp : TrendingDown,
            color: stats.totalPnL >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
            textColor: stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400',
        },
        {
            title: 'Open Trades',
            value: stats.openTrades,
            icon: Calendar,
            color: 'from-orange-500 to-yellow-500',
            textColor: 'text-orange-400',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-slate-400 mt-2">Track your trading performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 hover:border-slate-700 transition-all duration-300 group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className="relative">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TradeHeatmap trades={trades} />
                <AnalyticsCharts trades={trades} />
            </div>
        </div>
    );
};

export default Dashboard;
