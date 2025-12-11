import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon,
    Settings,
    Tags,
    Shield,
    AlertTriangle,
    Edit2,
    Trash2,
    Plus,
    Menu,
    X,
    Camera,
    Upload,
} from 'lucide-react';

interface Tag {
    _id: string;
    name: string;
    category: string;
    description?: string;
}

type Section = 'personal' | 'settings' | 'tags' | 'password' | 'danger';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<Section>('personal');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Personal Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePicturePreview, setProfilePicturePreview] = useState('');

    // Password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Settings
    const [currency, setCurrency] = useState('USD');
    const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
    const [pnlType, setPnlType] = useState('absolute');

    // Tags
    const [tags, setTags] = useState<Tag[]>([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagForm, setTagForm] = useState({ name: '', category: '', description: '' });

    //  Messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setProfilePicture((user as any).profilePicture || '');
            setProfilePicturePreview((user as any).profilePicture || '');
            if (user.settings) {
                setCurrency(user.settings.currency || 'USD');
                setDateFormat(user.settings.dateFormat || 'YYYY-MM-DD');
                setPnlType(user.settings.pnlType || 'absolute');
            }
        }
        fetchTags();
    }, [user]);

    const fetchTags = async () => {
        try {
            const res = await api.get('/tags');
            setTags(res.data);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfilePicture(base64String);
                setProfilePicturePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await api.put('/auth/profile', {
                name,
                email,
                profilePicture
            });
            setMessage('Personal info updated successfully');
            login(res.data.token, res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update personal info');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await api.put('/auth/profile', {
                settings: {
                    currency,
                    dateFormat,
                    pnlType
                }
            });
            setMessage('Settings updated successfully');
            login(res.data.token, res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await api.put('/auth/profile', { password });
            setMessage('Password updated successfully');
            setPassword('');
            setConfirmPassword('');
            login(res.data.token, res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleTagSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            if (editingTag) {
                await api.put(`/tags/${editingTag._id}`, tagForm);
                setMessage('Tag updated successfully');
            } else {
                await api.post('/tags', tagForm);
                setMessage('Tag created successfully');
            }
            setShowTagModal(false);
            setEditingTag(null);
            setTagForm({ name: '', category: '', description: '' });
            fetchTags();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save tag');
        }
    };

    const handleDeleteTag = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await api.delete(`/tags/${id}`);
                setMessage('Tag deleted successfully');
                fetchTags();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete tag');
            }
        }
    };

    const handleDeleteJournals = async () => {
        if (window.confirm('Are you sure you want to delete ALL journal entries? This action cannot be undone.')) {
            if (window.confirm('This will permanently delete all your journal data. Are you absolutely sure?')) {
                try {
                    await api.delete('/auth/journals');
                    setMessage('All journal entries deleted successfully');
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to delete journals');
                }
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('⚠️ WARNING: This will permanently delete your account and ALL your data (trades, journals, tags). This action CANNOT be undone.')) {
            if (window.confirm('Type DELETE in the next prompt to confirm')) {
                const confirmation = prompt('Type DELETE to confirm account deletion:');
                if (confirmation === 'DELETE') {
                    try {
                        await api.delete('/auth/account');
                        logout();
                        navigate('/login');
                    } catch (err: any) {
                        setError(err.response?.data?.message || 'Failed to delete account');
                    }
                }
            }
        }
    };

    const sidebarItems = [
        { id: 'personal' as Section, label: 'Personal Info', icon: UserIcon },
        { id: 'settings' as Section, label: 'Account Settings', icon: Settings },
        { id: 'tags' as Section, label: 'Tag Management', icon: Tags },
        { id: 'password' as Section, label: 'Password & Security', icon: Shield },
        { id: 'danger' as Section, label: 'Danger', icon: AlertTriangle, danger: true },
    ];

    const SidebarContent = () => (
        <>
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Profile Settings
            </h2>
            <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                } ${item.danger ? 'text-red-400 hover:text-red-300' : ''}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full relative">
            {/* Mobile Actions Header */}
            <div className="md:hidden flex items-center justify-between mb-2">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-slate-900/40 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 p-6 md:hidden overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-slate-300">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 h-fit">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 overflow-y-auto">
                {message && (
                    <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Personal Info Section */}
                {activeSection === 'personal' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                        <form onSubmit={handlePersonalInfoSubmit} className="space-y-6 max-w-lg">
                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-800">
                                <div className="relative group">
                                    {profilePicturePreview ? (
                                        <img
                                            src={profilePicturePreview}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 group-hover:border-blue-500 transition-all"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-slate-700 group-hover:border-blue-500 transition-all">
                                            <UserIcon className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                    <label
                                        htmlFor="profile-picture-upload"
                                        className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-3 rounded-full cursor-pointer transition-all shadow-lg group-hover:scale-110"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                    </label>
                                    <input
                                        id="profile-picture-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-400">Click the camera icon to upload</p>
                                    <p className="text-xs text-slate-500 mt-1">Max 2MB, JPG/PNG</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </motion.div>
                )}

                {/* Account Settings Section */}
                {activeSection === 'settings' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-lg">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="AUD">AUD ($)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Date Format</label>
                                <select
                                    value={dateFormat}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                                    <option value="DD-MM-YYYY">DD-MM-YYYY (31-12-2025)</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">PnL Type</label>
                                <select
                                    value={pnlType}
                                    onChange={(e) => setPnlType(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="absolute">Absolute Value ($)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    Determines how Profit/Loss is displayed in charts.
                                </p>
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </form>
                    </motion.div>
                )}

                {/* Tag Management Section */}
                {activeSection === 'tags' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Tag Management</h2>
                            <Button
                                onClick={() => {
                                    setEditingTag(null);
                                    setTagForm({ name: '', category: '', description: '' });
                                    setShowTagModal(true);
                                }}
                                className="gap-2 w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Add Tag
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {tags.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No tags yet. Create your first tag!</p>
                            ) : (
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead className="bg-slate-800/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Category</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Description</th>
                                                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {tags.map((tag) => (
                                                <tr key={tag._id} className="hover:bg-slate-800/30">
                                                    <td className="px-4 py-3 text-sm font-medium">{tag.name}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-400">{tag.category}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-400">{tag.description || '-'}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingTag(tag);
                                                                    setTagForm({
                                                                        name: tag.name,
                                                                        category: tag.category,
                                                                        description: tag.description || '',
                                                                    });
                                                                    setShowTagModal(true);
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTag(tag._id)}
                                                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Tag Modal */}
                        {showTagModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
                                >
                                    <h3 className="text-xl font-bold mb-4">{editingTag ? 'Edit Tag' : 'Add Tag'}</h3>
                                    <form onSubmit={handleTagSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-300 mb-2 block">Name</label>
                                            <input
                                                type="text"
                                                value={tagForm.name}
                                                onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                                            <input
                                                type="text"
                                                value={tagForm.category}
                                                onChange={(e) => setTagForm({ ...tagForm, category: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                required
                                                placeholder="e.g., Strategy, Market Condition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-300 mb-2 block">Description (Optional)</label>
                                            <textarea
                                                value={tagForm.description}
                                                onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[80px]"
                                                placeholder="Optional description..."
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button type="submit" className="flex-1">
                                                {editingTag ? 'Update Tag' : 'Create Tag'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowTagModal(false);
                                                    setEditingTag(null);
                                                    setTagForm({ name: '', category: '', description: '' });
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
                    </motion.div>
                )}

                {/* Password & Security Section */}
                {activeSection === 'password' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl font-bold mb-6">Edit Password & Security</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                    Password (6 Char min)
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                    Confirm Password (6 Char min)
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Confirm new password"
                                    minLength={6}
                                />
                            </div>
                            <Button type="submit" disabled={loading || !password || !confirmPassword}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </motion.div>
                )}

                {/* Danger Zone Section */}
                {activeSection === 'danger' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl font-bold mb-6 text-red-400">Danger Zone</h2>
                        <div className="space-y-6 max-w-2xl">
                            <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
                                <h3 className="text-lg font-semibold text-red-400 mb-2">Delete All Journal Data</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    Permanently delete all your journal entries. This action cannot be undone.
                                    Trades and tags will be preserved.
                                </p>
                                <Button
                                    onClick={handleDeleteJournals}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                                >
                                    Delete All Journals
                                </Button>
                            </div>

                            <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
                                <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    ⚠️ WARNING: This will permanently delete your account and ALL associated data
                                    including trades, journals, and tags. This action CANNOT be undone.
                                </p>
                                <Button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
export default Profile;
