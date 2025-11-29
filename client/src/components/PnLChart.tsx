import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface Trade {
    _id: string;
    pair: string;
    pnl?: number;
    entryDate: string;
    exitDate?: string;
    status: 'OPEN' | 'CLOSED';
}

interface PnLChartProps {
    trades: Trade[];
}

const PnLChart = ({ trades }: PnLChartProps) => {
    // Calculate cumulative P&L over time
    const chartData = trades
        .filter((t) => t.status === 'CLOSED' && t.pnl !== undefined)
        .sort((a, b) => new Date(a.exitDate || a.entryDate).getTime() - new Date(b.exitDate || b.entryDate).getTime())
        .reduce((acc: any[], trade, index) => {
            const prevPnL = index > 0 ? acc[index - 1].cumulativePnL : 0;
            const cumulativePnL = prevPnL + (trade.pnl || 0);

            return [
                ...acc,
                {
                    date: new Date(trade.exitDate || trade.entryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    pnl: trade.pnl || 0,
                    cumulativePnL: parseFloat(cumulativePnL.toFixed(2)),
                },
            ];
        }, []);

    if (chartData.length === 0) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">P&L Over Time</h3>
                <div className="flex items-center justify-center h-64 text-slate-500">
                    No closed trades yet. Complete some trades to see your P&L chart.
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
        >
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                P&L Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="cumulativePnL"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Cumulative P&L"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default PnLChart;
