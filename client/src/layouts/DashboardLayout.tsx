import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { TrendingUp, BarChart2, BookOpen, LogOut, User, LayoutDashboard, BarChart3, HelpCircle, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HelpWidget from '../components/HelpWidget';
import AccountWidget from '../components/AccountWidget';

const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Trades', path: '/trades', icon: TrendingUp },
        { name: 'Journal', path: '/journal', icon: BookOpen },
        { name: 'Stats', path: '/stats', icon: BarChart3 },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    const SidebarContent = () => (
        <>
            <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
                <div className={`p-6 pb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                            CryptoJournal
                        </h1>
                    )}
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Desktop Collapse Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-auto"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {!isCollapsed && <AccountWidget />}

                {/* User Profile Section */}
                {user && (
                    <div className={`px-4 py-3 border-b border-slate-800/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
                        <Link to="/profile" className={`flex items-center gap-3 hover:bg-slate-800/30 p-2 rounded-lg transition-all group ${isCollapsed ? 'justify-center' : ''}`}>
                            {(user as any).profilePicture ? (
                                <img
                                    src={(user as any).profilePicture}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-all"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            )}
                        </Link>
                    </div>
                )}

                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.name : ''}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    title={isCollapsed ? 'Logout' : ''}
                    className={`flex items-center gap-3 px-4 py-3 m-4 mt-auto rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20 ${isCollapsed ? 'justify-center px-2' : ''}`}
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="h-screen bg-[#0f172a] text-white flex flex-col md:flex-row relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

            {/* Mobile Header */}
            <header className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        CryptoJournal
                    </span>
                </div>
                <Link to="/profile" className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 active:scale-95 transition-transform overflow-hidden">
                    {(user as any)?.profilePicture ? (
                        <img
                            src={(user as any).profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-blue-400" />
                    )}
                </Link>
            </header>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col md:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900/40 backdrop-blur-xl border-r border-slate-800 flex-col relative z-20 h-full transition-all duration-300`}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10 w-full">
                <Outlet />
            </main>

            {/* Help Widget */}
            <HelpWidget />
        </div>
    );
};

export default DashboardLayout;
