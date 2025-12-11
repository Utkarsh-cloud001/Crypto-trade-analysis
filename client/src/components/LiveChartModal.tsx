import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import { useEffect, useRef } from 'react';

interface LiveChartModalProps {
    isOpen: boolean;
    symbol: 'BTCUSDT' | 'ETHUSDT';
    onClose: () => void;
}

const LiveChartModal = ({ isOpen, symbol, onClose }: LiveChartModalProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create TradingView widget script
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (containerRef.current && (window as any).TradingView) {
                new (window as any).TradingView.widget({
                    autosize: true,
                    symbol: `BINANCE:${symbol}`,
                    interval: '15',
                    timezone: 'Etc/UTC',
                    theme: 'dark',
                    style: '1',
                    locale: 'en',
                    toolbar_bg: '#0f172a',
                    enable_publishing: false,
                    hide_side_toolbar: false,
                    allow_symbol_change: false,
                    container_id: 'tradingview_chart',
                    backgroundColor: '#0f172a',
                    gridColor: '#1e293b',
                });
            }
        };

        const chartDiv = document.createElement('div');
        chartDiv.id = 'tradingview_chart';
        chartDiv.style.height = '100%';
        chartDiv.style.width = '100%';
        containerRef.current.appendChild(chartDiv);
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, [isOpen, symbol]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-full text-white transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="relative max-w-6xl max-h-[90vh] w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <h2 className="text-xl font-bold text-white">
                            {symbol === 'BTCUSDT' ? 'Bitcoin (BTC/USDT)' : 'Ethereum (ETH/USDT)'}
                        </h2>
                        <p className="text-sm text-slate-400">Live Chart from Binance</p>
                    </div>
                    <div ref={containerRef} className="w-full h-[calc(100%-5rem)]" />
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default LiveChartModal;
