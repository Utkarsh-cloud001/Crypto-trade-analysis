import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Target,
    Clock,
    DollarSign,
    Activity,
    BarChart3,
} from 'lucide-react';

interface StatsData {
    winRate: number;
    expectancy: number;
    profitFactor: number;
    avgWinHold: number;
    avgLossHold: number;
    avgLoss: number;
    winStreak: number;
    lossStreak: number;
    topLoss: number;
    topWin: number;
    avgDailyVolume: number;
    avgSize: number;
    equityCurve: Array<{ date: string; value: number }>;
    performanceByDay: Array<{ day: string; winRate: number; pnl: number; trades: number }>;
    performanceByHour: Array<{ hour: number; winRate: number; pnl: number; trades: number }>;
}

const Stats = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [dateRange, setDateRange] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    const fetchStats = async (range: string) => {
        try {
            setLoading(true);
            const params: any = {};

            const now = new Date();
            switch (range) {
                case 'today':
                    params.startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                    break;
                case 'yesterday':
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    params.startDate = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
                    params.endDate = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();
                    break;
                case 'thisWeek':
                    const weekStart = new Date(now);
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    params.startDate = new Date(weekStart.setHours(0, 0, 0, 0)).toISOString();
                    break;
                case 'lastWeek':
                    const lastWeekStart = new Date(now);
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
                    params.startDate = new Date(lastWeekStart.setHours(0, 0, 0, 0)).toISOString();
                    params.endDate = new Date(lastWeekEnd.setHours(23, 59, 59, 999)).toISOString();
                    break;
                case 'thisMonth':
                    params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                    break;
                case 'lastMonth':
                    params.startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
                    params.endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
                    break;
                case 'thisYear':
                    params.startDate = new Date(now.getFullYear(), 0, 1).toISOString();
                    break;
                case 'lastYear':
                    params.startDate = new Date(now.getFullYear() - 1, 0, 1).toISOString();
                    params.endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString();
                    break;
            }

            const queryString = new URLSearchParams(params).toString();
            const res = await api.get(`/stats${queryString ? `?${queryString}` : ''}`);
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(dateRange);
    }, [dateRange]);

    const StatCard = ({ label, value, icon: Icon, trend }: any) => (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-slate-400">{label}</span>
                <Icon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {trend && (
                <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-400">Loading statistics...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-400">No data available</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Date Filters */}
            <div>
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Advanced Statistics
                </h1>

                {/* Date Range Filters */}
                <div className="flex flex-wrap gap-2">
                    {['Today', 'Yesterday', 'This wk.', 'Last wk.', 'This mo.', 'Last mo.', 'This yr.', 'Last yr.', 'Reset'].map((label, index) => {
                        const values = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear', 'all'];
                        const value = values[index];

                        return (
                            <button
                                key={value}
                                onClick={() => setDateRange(value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stat Cards Grid - 2 rows x 6 columns */}
            <div className="grid grid-cols-6 gap-4">
                <StatCard label="WIN RATE" value={`${stats.winRate}%`} icon={Target} />
                <StatCard label="EXPECTANCY" value={stats.expectancy} icon={TrendingUp} />
                <StatCard label="PROFIT FACTOR" value={stats.profitFactor.toFixed(2)} icon={DollarSign} />
                <StatCard label="AVG WIN HOLD" value={`${stats.avgWinHold}h`} icon={Clock} />
                <StatCard label="AVG LOSS HOLD" value={`${stats.avgLossHold}h`} icon={Clock} />
                <StatCard label="AVG LOSS" value={`$${stats.avgLoss.toFixed(2)} (-3.7%)`} icon={TrendingDown} />

                <StatCard label="WIN STREAK" value={stats.winStreak} icon={Activity} />
                <StatCard label="LOSS STREAK" value={stats.lossStreak} icon={Activity} />
                <StatCard label="TOP LOSS" value={`$${Math.abs(stats.topLoss).toFixed(2)} (${stats.topLoss.toFixed(1)}%)`} icon={TrendingDown} />
                <StatCard label="TOP WIN" value={`$${stats.topWin.toFixed(2)} (${stats.topWin.toFixed(1)}%)`} icon={TrendingUp} />
                <StatCard label="AVG DAILY VOL" value={stats.avgDailyVolume} icon={BarChart3} />
                <StatCard label="AVG SIZE" value={stats.avgSize.toFixed(0)} icon={DollarSign} />
            </div>

            {/* Equity Curve */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">EQUITY CURVE</h3>
                <div className="h-64 flex items-end gap-1">
                    {stats.equityCurve.length > 0 ? (
                        stats.equityCurve.map((point, index) => {
                            const maxValue = Math.max(...stats.equityCurve.map(p => p.value));
                            const minValue = Math.min(...stats.equityCurve.map(p => p.value));
                            const height = ((point.value - minValue) / (maxValue - minValue)) * 100;

                            return (
                                <div
                                    key={index}
                                    className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/80 rounded-t"
                                    style={{ height: `${height}%` }}
                                    title={`${new Date(point.date).toLocaleDateString()}: $${point.value.toFixed(2)}`}
                                />
                            );
                        })
                    ) : (
                        <div className="text-slate-400 text-center w-full">No data for equity curve</div>
                    )}
                </div>
            </div>

            {/* Performance Charts Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Performance by Day of Week */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">PERFORMANCE BY DAY OF WEEK</h3>
                    <div className="h-48 flex items-end gap-2">
                        {stats.performanceByDay.length > 0 ? (
                            stats.performanceByDay.map((day, index) => {
                                const maxWinRate = Math.max(...stats.performanceByDay.map(d => d.winRate));
                                const height = (day.winRate / maxWinRate) * 100;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-500 rounded-t"
                                            style={{ height: `${height}%` }}
                                            title={`${day.day}: ${(day.winRate * 100).toFixed(1)}% win rate`}
                                        />
                                        <span className="text-xs text-slate-400">{day.day}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-slate-400 text-center w-full">No data</div>
                        )}
                    </div>
                </div>

                {/* Performance by Hour */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">PERFORMANCE BY HOUR</h3>
                    <div className="h-48 flex items-end gap-1">
                        {stats.performanceByHour.length > 0 ? (
                            stats.performanceByHour.map((hour, index) => {
                                const maxWinRate = Math.max(...stats.performanceByHour.map(h => h.winRate));
                                const height = (hour.winRate / maxWinRate) * 100;

                                return (
                                    <div key={index} className="flex-1">
                                        <div
                                            className="w-full bg-blue-500 rounded-t"
                                            style={{ height: `${height}%` }}
                                            title={`${hour.hour}:00: ${(hour.winRate * 100).toFixed(1)}% win rate`}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-slate-400 text-center w-full">No data</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
