import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import ImagePreviewModal from '../components/ImagePreviewModal';
import { useCurrency } from '../context/CurrencyContext';
import { getBaseURL } from '../utils/url';

interface Trade {
    _id: string;
    pair: string;
    type: 'LONG' | 'SHORT';
    entryPrice: number;
    exitPrice?: number;
    amount: number;
    pnl?: number;
    status: 'OPEN' | 'CLOSED';
    entryDate: string;
    notes?: string;
    screenshot?: string;
    method?: string;
    stopLoss?: number;
    takeProfit?: number;
    fees?: number;
}

const Trades = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { formatCurrency } = useCurrency();
    const [formData, setFormData] = useState({
        pair: '',
        type: 'LONG' as 'LONG' | 'SHORT',
        method: '',
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
        amount: '',
        notes: '',
        screenshot: '',
        status: 'OPEN' as 'OPEN' | 'CLOSED',
        exitPrice: '',
        entryDate: '',
        fees: '',
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const uploadData = new FormData();
            uploadData.append('image', file);

            try {
                const res = await api.post('/upload', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setFormData((prev) => ({ ...prev, screenshot: res.data }));
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const res = await api.get('/trades');
            setTrades(res.data);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                entryPrice: parseFloat(formData.entryPrice),
                stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
                takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
                amount: parseFloat(formData.amount),
                status: formData.status,
                exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
                entryDate: formData.entryDate ? new Date(formData.entryDate).toISOString() : undefined,
                fees: formData.fees ? parseFloat(formData.fees) : 0,
            };

            if (editingId) {
                await api.put(`/trades/${editingId}`, payload);
            } else {
                await api.post('/trades', payload);
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({ pair: '', type: 'LONG', method: '', entryPrice: '', stopLoss: '', takeProfit: '', amount: '', notes: '', screenshot: '', status: 'OPEN', exitPrice: '', entryDate: '', fees: '' });
            fetchTrades();
        } catch (error) {
            console.error('Failed to save trade:', error);
        }
    };

    const handleEdit = (trade: Trade) => {
        setEditingId(trade._id);
        setFormData({
            pair: trade.pair,
            type: trade.type,
            method: trade.method || '',
            entryPrice: trade.entryPrice.toString(),
            stopLoss: trade.stopLoss?.toString() || '',
            takeProfit: trade.takeProfit?.toString() || '',
            amount: trade.amount.toString(),
            notes: trade.notes || '',
            screenshot: trade.screenshot || '',
            status: trade.status,
            exitPrice: trade.exitPrice?.toString() || '',
            entryDate: trade.entryDate ? new Date(trade.entryDate).toISOString().slice(0, 16) : '',
            fees: trade.fees?.toString() || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this trade?')) {
            try {
                await api.delete(`/trades/${id}`);
                fetchTrades();
            } catch (error) {
                console.error('Failed to delete trade:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Trades
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your trading history</p>
                </motion.div>
                <Button onClick={() => setShowModal(true)} className="gap-2">
                    <Plus className="w-5 h-5" />
                    Add Trade
                </Button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Pair</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Entry</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Fees</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">P&L</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {trades.map((trade) => (
                                <motion.tr
                                    key={trade._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium">{trade.pair}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${trade.type === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {trade.type === 'LONG' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {trade.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{formatCurrency(trade.entryPrice)}</td>
                                    <td className="px-6 py-4">{trade.amount}</td>
                                    <td className="px-6 py-4 text-slate-400">{formatCurrency(trade.fees || 0)}</td>
                                    <td className="px-6 py-4">
                                        {trade.pnl !== undefined ? (
                                            <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                {formatCurrency(trade.pnl)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${trade.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {trade.screenshot && (
                                                <div className="relative group">
                                                    <button
                                                        onClick={() => {
                                                            setPreviewImage(`${getBaseURL()}${trade.screenshot}`);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-all relative"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                    </button>
                                                    {/* Hover Preview Popup */}
                                                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                                                        <div className="bg-slate-900 border-2 border-blue-500/50 rounded-lg overflow-hidden shadow-2xl">
                                                            <img
                                                                src={`${getBaseURL()}${trade.screenshot}`}
                                                                alt="Trade Screenshot Preview"
                                                                className="w-48 h-32 object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={() => handleEdit(trade)} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(trade._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Trade Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Trade' : 'Add New Trade'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Pair"
                                    placeholder="BTC/USDT"
                                    value={formData.pair}
                                    onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="LONG"
                                                checked={formData.type === 'LONG'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'LONG' })}
                                            />
                                            <span>LONG</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="SHORT"
                                                checked={formData.type === 'SHORT'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'SHORT' })}
                                            />
                                            <span>SHORT</span>
                                        </label>
                                    </div>
                                </div>
                                <Input
                                    label="Method/Strategy (Optional)"
                                    placeholder="e.g., Breakout, Support/Resistance"
                                    value={formData.method}
                                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Entry Price"
                                        type="number"
                                        step="0.01"
                                        placeholder="50000.00"
                                        value={formData.entryPrice}
                                        onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Amount"
                                        type="number"
                                        step="0.001"
                                        placeholder="0.5"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Entry Date (Optional)"
                                        type="datetime-local"
                                        value={formData.entryDate}
                                        onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                                    />
                                    <Input
                                        label="Fees (Optional)"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.fees}
                                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                    />
                                </div>
                                {editingId && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-300 mb-2 block">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'OPEN' | 'CLOSED' })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            >
                                                <option value="OPEN">OPEN</option>
                                                <option value="CLOSED">CLOSED</option>
                                            </select>
                                        </div>
                                        {formData.status === 'CLOSED' && (
                                            <Input
                                                label="Exit Price"
                                                type="number"
                                                step="0.01"
                                                placeholder="52000.00"
                                                value={formData.exitPrice}
                                                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                                                required
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Stop Loss (Optional)"
                                        type="number"
                                        step="0.01"
                                        placeholder="48000.00"
                                        value={formData.stopLoss}
                                        onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                                    />
                                    <Input
                                        label="Take Profit (Optional)"
                                        type="number"
                                        step="0.01"
                                        placeholder="55000.00"
                                        value={formData.takeProfit}
                                        onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="Notes (Optional)"
                                    placeholder="Trade setup and reasoning..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Screenshot</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-500/10 file:text-blue-400
                                            hover:file:bg-blue-500/20"
                                    />
                                    {formData.screenshot && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="text-xs text-green-400">Image uploaded successfully!</p>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, screenshot: '' }))}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                (Remove)
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="flex-1">
                                        {editingId ? 'Update Trade' : 'Add Trade'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingId(null);
                                            setFormData({ pair: '', type: 'LONG', method: '', entryPrice: '', stopLoss: '', takeProfit: '', amount: '', notes: '', screenshot: '', status: 'OPEN', exitPrice: '', entryDate: '', fees: '' });
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={isPreviewOpen}
                imageUrl={previewImage}
                onClose={() => {
                    setIsPreviewOpen(false);
                    setPreviewImage(null);
                }}
            />
        </div>
    );
};

export default Trades;
