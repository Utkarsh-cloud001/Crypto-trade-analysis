import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    X,
    MessageCircle,
    Lightbulb,
    Megaphone,
    ChevronUp,
    Bell,
} from 'lucide-react';

interface Feature {
    _id: string;
    title: string;
    description: string;
    category: 'feature' | 'announcement';
    votes: number;
    status: 'pending' | 'in-progress' | 'completed';
    voters: string[];
}

const HelpWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'main' | 'vote' | 'request'>('main');
    const [features, setFeatures] = useState<Feature[]>([]);
    const [announcements, setAnnouncements] = useState<Feature[]>([]);
    const [newFeature, setNewFeature] = useState({ title: '', description: '' });

    useEffect(() => {
        if (isOpen) {
            fetchFeatures();
        }
    }, [isOpen]);

    const fetchFeatures = async () => {
        try {
            const res = await api.get('/features');
            const allFeatures = res.data;
            setFeatures(allFeatures.filter((f: Feature) => f.category === 'feature'));
            setAnnouncements(allFeatures.filter((f: Feature) => f.category === 'announcement'));
        } catch (error) {
            console.error('Failed to fetch features:', error);
        }
    };

    const handleVote = async (featureId: string) => {
        try {
            await api.post(`/features/${featureId}/vote`);
            fetchFeatures();
        } catch (error: any) {
            console.error('Failed to vote:', error);
            alert(error.response?.data?.message || 'Failed to vote');
        }
    };

    const handleUnvote = async (featureId: string) => {
        try {
            await api.delete(`/features/${featureId}/vote`);
            fetchFeatures();
        } catch (error: any) {
            console.error('Failed to unvote:', error);
        }
    };

    const handleSubmitFeature = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/features', newFeature);
            setNewFeature({ title: '', description: '' });
            setActiveSection('main');
            fetchFeatures();
        } catch (error) {
            console.error('Failed to submit feature:', error);
        }
    };

    return (
        <>
            {/* Floating Help Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <HelpCircle className="w-6 h-6" />
                {announcements.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold text-white">Hi there 👋</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Let's improve our service by discussing ideas, suggestions, and resolving issues together!
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Main Menu */}
                                {activeSection === 'main' && (
                                    <>
                                        {/* Announcements */}
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Megaphone className="w-5 h-5 text-purple-400 mt-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white mb-1">Announcements & Updates</h3>
                                                    <p className="text-sm text-slate-300">New features, releases, and relevant news!</p>
                                                    {announcements.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {announcements.slice(0, 2).map(announcement => (
                                                                <div key={announcement._id} className="text-sm text-slate-300 flex items-start gap-2">
                                                                    <Bell className="w-4 h-4 text-purple-400 mt-0.5" />
                                                                    <span>{announcement.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Live Support */}
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer">
                                            <div className="flex items-start gap-3">
                                                <MessageCircle className="w-5 h-5 text-blue-400 mt-1" />
                                                <div>
                                                    <h3 className="font-semibold text-white mb-1">Live Support</h3>
                                                    <p className="text-sm text-slate-400">Live-ish support chat. Questions?</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Request a Feature */}
                                        <div
                                            onClick={() => setActiveSection('request')}
                                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className="w-5 h-5 text-yellow-400 mt-1" />
                                                <div>
                                                    <h3 className="font-semibold text-white mb-1">Request a Feature</h3>
                                                    <p className="text-sm text-slate-400">Suggest new features (Public Board)</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vote */}
                                        <div
                                            onClick={() => setActiveSection('vote')}
                                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <ChevronUp className="w-5 h-5 text-green-400 mt-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white mb-1">Vote</h3>
                                                    <p className="text-sm text-slate-400">Vote for features to be added.</p>
                                                    {features.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {features.slice(0, 3).map(feature => (
                                                                <div key={feature._id} className="flex items-center justify-between text-sm">
                                                                    <span className="text-slate-300">{feature.title}</span>
                                                                    <span className="text-slate-400">{feature.votes}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Account Settings Link */}
                                        <div className="pt-4 border-t border-slate-800">
                                            <a
                                                href="/profile"
                                                className="text-sm text-slate-400 hover:text-white transition-colors"
                                            >
                                                Account settings
                                            </a>
                                        </div>
                                    </>
                                )}

                                {/* Vote Section */}
                                {activeSection === 'vote' && (
                                    <>
                                        <button
                                            onClick={() => setActiveSection('main')}
                                            className="text-sm text-blue-400 hover:text-blue-300 mb-4"
                                        >
                                            ← Back
                                        </button>
                                        <h3 className="text-xl font-bold text-white mb-4">Vote for Features</h3>
                                        <div className="space-y-3">
                                            {features.map(feature => (
                                                <div
                                                    key={feature._id}
                                                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            onClick={() => handleVote(feature._id)}
                                                            className="flex flex-col items-center gap-1 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                                                        >
                                                            <ChevronUp className="w-4 h-4 text-green-400" />
                                                            <span className="text-xs text-white">{feature.votes}</span>
                                                        </button>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                                            <p className="text-sm text-slate-400">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Request Feature Section */}
                                {activeSection === 'request' && (
                                    <>
                                        <button
                                            onClick={() => setActiveSection('main')}
                                            className="text-sm text-blue-400 hover:text-blue-300 mb-4"
                                        >
                                            ← Back
                                        </button>
                                        <h3 className="text-xl font-bold text-white mb-4">Request a Feature</h3>
                                        <form onSubmit={handleSubmitFeature} className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                                    Feature Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newFeature.title}
                                                    onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                    placeholder="e.g., TradingView Charts"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newFeature.description}
                                                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                                    required
                                                    placeholder="Describe the feature you'd like to see..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
                                            >
                                                Submit Feature Request
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default HelpWidget;
