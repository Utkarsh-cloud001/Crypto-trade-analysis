import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Smile, Meh, Frown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import { getBaseURL } from '../utils/url';

interface JournalEntry {
    _id: string;
    title: string;
    content: string;
    date: string;
    mood?: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'BAD' | 'TERRIBLE';
    tags?: string[];

    images?: string[];
}

interface Trade {
    _id: string;
    pair: string;
    type: 'LONG' | 'SHORT';
    entryPrice: number;
    amount: number;
    pnl?: number;
    status: 'OPEN' | 'CLOSED';
    entryDate: string;
}

const Journal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood: 'NEUTRAL' as 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'BAD' | 'TERRIBLE',
        images: [] as string[],
        date: '',
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
                setFormData((prev) => ({ ...prev, images: [...prev.images, res.data] }));
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await api.get('/journal');
            setEntries(res.data);
        } catch (error) {
            console.error('Failed to fetch journal entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrades = async () => {
        try {
            const res = await api.get('/trades');
            setTrades(res.data);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                date: formData.date ? new Date(formData.date).toISOString() : undefined,
            };

            if (editingId) {
                await api.put(`/journal/${editingId}`, payload);
            } else {
                await api.post('/journal', payload);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ title: '', content: '', mood: 'NEUTRAL', images: [], date: '' });
            fetchEntries();
        } catch (error) {
            console.error('Failed to save journal entry:', error);
        }
    };

    const handleEdit = (entry: JournalEntry) => {
        setEditingId(entry._id);
        setFormData({
            title: entry.title,
            content: entry.content,
            mood: entry.mood || 'NEUTRAL',
            images: entry.images || [],
            date: entry.date ? new Date(entry.date).toISOString().slice(0, 16) : '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await api.delete(`/journal/${id}`);
                fetchEntries();
            } catch (error) {
                console.error('Failed to delete entry:', error);
            }
        }
    };

    const getMoodIcon = (mood?: string) => {
        switch (mood) {
            case 'EXCELLENT':
            case 'GOOD':
                return <Smile className="w-5 h-5 text-green-400" />;
            case 'NEUTRAL':
                return <Meh className="w-5 h-5 text-yellow-400" />;
            case 'BAD':
            case 'TERRIBLE':
                return <Frown className="w-5 h-5 text-red-400" />;
            default:
                return null;
        }
    };

    const getMoodColor = (mood?: string) => {
        switch (mood) {
            case 'EXCELLENT':
            case 'GOOD':
                return 'border-green-500/30 bg-green-500/5';
            case 'NEUTRAL':
                return 'border-yellow-500/30 bg-yellow-500/5';
            case 'BAD':
            case 'TERRIBLE':
                return 'border-red-500/30 bg-red-500/5';
            default:
                return 'border-slate-800 bg-slate-900/40';
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
                        Trading Journal
                    </h1>
                    <p className="text-slate-400 mt-2">Document your trading journey and insights</p>
                </motion.div>
                <Button onClick={() => setShowModal(true)} className="gap-2">
                    <Plus className="w-5 h-5" />
                    New Entry
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`backdrop-blur-xl border rounded-2xl p-6 ${getMoodColor(entry.mood)}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {getMoodIcon(entry.mood)}
                                    <h3 className="text-xl font-bold text-white">{entry.title}</h3>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    {new Date(entry.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(entry)}
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(entry._id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                        {entry.tags && entry.tags.length > 0 && (
                            <div className="flex gap-2 mt-4">
                                {entry.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 rounded-lg text-xs bg-slate-800/50 text-slate-400"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {entry.images && entry.images.length > 0 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {entry.images.map((img, i) => (
                                    <a
                                        key={i}
                                        href={`${getBaseURL().replace(/\/api$/, '')}${img}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors"
                                    >
                                        <img src={`${getBaseURL().replace(/\/api$/, '')}${img}`} alt="attachment" className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Linked Trades Section */}
                        {trades.filter(t => new Date(t.entryDate).toDateString() === new Date(entry.date).toDateString()).length > 0 && (
                            <div className="mt-6 pt-4 border-t border-slate-800">
                                <h4 className="text-sm font-medium text-slate-400 mb-3">Trades from this day</h4>
                                <div className="space-y-2">
                                    {trades
                                        .filter(t => new Date(t.entryDate).toDateString() === new Date(entry.date).toDateString())
                                        .map(trade => (
                                            <div key={trade._id} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between border border-slate-800/50">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${trade.type === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {trade.type === 'LONG' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        {trade.type}
                                                    </span>
                                                    <span className="font-medium text-slate-200">{trade.pair}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-slate-400">Amt: {trade.amount}</span>
                                                    {trade.pnl !== undefined ? (
                                                        <span className={trade.pnl >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                                                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600">-</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Entry Modal */}
            {createPortal(
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Entry' : 'New Journal Entry'}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Mood</label>
                                        <div className="flex gap-2">
                                            {(['EXCELLENT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE'] as const).map((mood) => (
                                                <button
                                                    key={mood}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, mood })}
                                                    className={`p-3 rounded-lg border-2 transition-all ${formData.mood === mood
                                                        ? 'border-blue-500 bg-blue-500/10'
                                                        : 'border-slate-700 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className="text-xs font-medium capitalize">{mood.toLowerCase()}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Input
                                        label="Date (Optional)"
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Content</label>
                                        <textarea
                                            className="flex min-h-[150px] w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                            placeholder="What happened today? What did you learn?"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Attachments</label>
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
                                        <div className="flex gap-2 mt-2">
                                            {formData.images.map((img, i) => (
                                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                                                    <img src={`${getBaseURL().replace(/\/api$/, '')}${img}`} alt="attachment" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" className="flex-1">
                                            {editingId ? 'Update Entry' : 'Save Entry'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingId(null);
                                                setFormData({ title: '', content: '', mood: 'NEUTRAL', images: [], date: '' });
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
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default Journal;
