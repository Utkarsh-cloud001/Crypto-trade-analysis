import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Trade {
    pair: string;
    pnl?: number;
    status: 'OPEN' | 'CLOSED';
}

interface AnalyticsChartsProps {
    trades: Trade[];
}

const AnalyticsCharts = ({ trades }: AnalyticsChartsProps) => {
    const closedTrades = trades.filter((t) => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0).length;
    const losingTrades = closedTrades.filter((t) => (t.pnl || 0) <= 0).length;

    const pieData = [
        { name: 'Wins', value: winningTrades },
        { name: 'Losses', value: losingTrades },
    ];

    const COLORS = ['#4ade80', '#f87171'];

    // Aggregate P&L by Pair
    const pairData = trades.reduce((acc: Record<string, number>, trade) => {
        if (trade.status === 'CLOSED' && trade.pnl) {
            acc[trade.pair] = (acc[trade.pair] || 0) + trade.pnl;
        }
        return acc;
    }, {});

    const barData = Object.entries(pairData).map(([pair, pnl]) => ({
        pair,
        pnl,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Win/Loss Ratio */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Win/Loss Ratio
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* P&L by Pair */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    P&L by Pair
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="pair" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
                            />
                            <Bar dataKey="pnl" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#4ade80' : '#f87171'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
