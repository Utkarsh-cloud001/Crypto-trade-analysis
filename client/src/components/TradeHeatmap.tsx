import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

interface Trade {
    entryDate: string;
    pnl?: number;
}

interface TradeHeatmapProps {
    trades: Trade[];
}

const TradeHeatmap = ({ trades }: TradeHeatmapProps) => {
    // Aggregate P&L by date
    const dailyData = trades.reduce((acc: Record<string, number>, trade) => {
        const date = new Date(trade.entryDate).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + (trade.pnl || 0);
        return acc;
    }, {});

    const values = Object.entries(dailyData).map(([date, count]) => ({ date, count }));

    // Relaxed typings for classForValue and tooltipDataAttrs to avoid TS errors during build
    const getClassForValue = (value: any) => {
        if (!value) return 'color-empty';
        if (value.count > 0) return `color-scale-green-${Math.min(4, Math.ceil(value.count / 100))}`;
        if (value.count < 0) return `color-scale-red-${Math.min(4, Math.ceil(Math.abs(value.count) / 100))}`;
        return 'color-empty';
    };

    const tooltipDataAttrs = (value: any) => {
        if (!value || !value.date) return {};
        return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': `${value.date}: $${value.count.toFixed(2)}`,
        };
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trading Activity (Daily P&L)
            </h3>
            <div className="heatmap-container">
                <CalendarHeatmap
                    startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                    endDate={new Date()}
                    values={values}
                    classForValue={getClassForValue}
                    tooltipDataAttrs={tooltipDataAttrs as any}
                    showWeekdayLabels
                />
                <Tooltip id="heatmap-tooltip" />
            </div>
            <style>{`
                .heatmap-container text { fill: #94a3b8; font-size: 10px; }
                .react-calendar-heatmap .color-empty { fill: #1e293b; rx: 2px; ry: 2px; }
                .react-calendar-heatmap rect { rx: 2px; ry: 2px; }
                .react-calendar-heatmap .color-scale-green-1 { fill: #064e3b; }
                .react-calendar-heatmap .color-scale-green-2 { fill: #065f46; }
                .react-calendar-heatmap .color-scale-green-3 { fill: #047857; }
                .react-calendar-heatmap .color-scale-green-4 { fill: #059669; }
                .react-calendar-heatmap .color-scale-red-1 { fill: #7f1d1d; }
                .react-calendar-heatmap .color-scale-red-2 { fill: #991b1b; }
                .react-calendar-heatmap .color-scale-red-3 { fill: #b91c1c; }
                .react-calendar-heatmap .color-scale-red-4 { fill: #dc2626; }
            `}</style>
        </div>
    );
};

export default TradeHeatmap;
