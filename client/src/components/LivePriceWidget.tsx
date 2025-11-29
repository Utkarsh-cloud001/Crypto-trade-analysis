import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoPrice {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
}

const LivePriceWidget = () => {
    const [prices, setPrices] = useState<CryptoPrice[]>([
        { symbol: 'BTC', name: 'Bitcoin', price: 0, change24h: 0 },
        { symbol: 'ETH', name: 'Ethereum', price: 0, change24h: 0 },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
                );
                const data = await response.json();

                setPrices([
                    {
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        price: data.bitcoin.usd,
                        change24h: data.bitcoin.usd_24h_change,
                    },
                    {
                        symbol: 'ETH',
                        name: 'Ethereum',
                        price: data.ethereum.usd,
                        change24h: data.ethereum.usd_24h_change,
                    },
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch crypto prices:', error);
                setLoading(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 animate-pulse"
                    >
                        <div className="h-6 bg-slate-700 rounded w-20 mb-2" />
                        <div className="h-8 bg-slate-700 rounded w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((crypto, index) => (
                <motion.div
                    key={crypto.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-slate-400 text-sm">{crypto.name}</p>
                            <p className="text-2xl font-bold text-white">
                                ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-3xl font-bold text-slate-700">{crypto.symbol}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        {crypto.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {crypto.change24h >= 0 ? '+' : ''}
                            {crypto.change24h.toFixed(2)}% (24h)
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LivePriceWidget;
