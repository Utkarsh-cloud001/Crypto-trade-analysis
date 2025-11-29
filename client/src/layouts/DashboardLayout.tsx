import { ReactNode } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { TrendingUp, BarChart2, BookOpen, LogOut, User, LayoutDashboard, BarChart3, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HelpWidget from '../components/HelpWidget';
import AccountWidget from '../components/AccountWidget';

const DashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="h-screen bg-[#0f172a] text-white flex relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />

            {/* Sidebar */}
            <aside
                className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800 flex flex-col relative z-10"
            >
                <div className="p-6 pb-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        CryptoJournal
                    </h1>
                </div>

                <AccountWidget />

                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto relative z-10">
                <Outlet />
            </main>

            {/* Help Widget */}
            <HelpWidget />
        </div>
    );
};

export default DashboardLayout;
