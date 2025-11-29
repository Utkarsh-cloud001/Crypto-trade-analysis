import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart2,
    Shield,
    Zap,
    Globe,
    ChevronRight,
    Play,
    TrendingUp,
    Layout,
    Cpu,
    Users
} from 'lucide-react';
import Hero3D from '../components/landing/Hero3D';
import FeatureCard from '../components/landing/FeatureCard';
import PricingSection from '../components/landing/PricingSection';

const LandingPage = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const position = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    const GlowText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <motion.span
            className={`inline-block cursor-default transition-colors ${className}`}
            whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px rgba(6,182,212,0.5)",
                filter: "brightness(1.2)"
            }}
        >
            {children}
        </motion.span>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
            {/* Background 3D Scene */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Hero3D />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            CryptoJournal
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={targetRef} className="relative z-10 min-h-screen flex items-center justify-center pt-20">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        style={{ opacity, scale, y: position }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium cursor-default"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            Next Gen Trading Journal
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold leading-tight"
                        >
                            <GlowText>Track.</GlowText> <GlowText>Analyze.</GlowText> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient hover:brightness-125 transition-all cursor-default">
                                Master Your Trades.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-400 max-w-xl leading-relaxed"
                        >
                            <span className="hover:text-white transition-colors duration-300 cursor-default">A futuristic crypto trading journal built for precision and performance.</span>{' '}
                            <span className="hover:text-cyan-400 transition-colors duration-300 cursor-default">Leverage AI-driven insights and 3D visualization to dominate the market.</span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link
                                to="/register"
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center gap-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1"
                            >
                                Start For Free <ChevronRight className="w-5 h-5" />
                            </Link>
                            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-sm">
                                <Play className="w-5 h-5 fill-current" /> Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-8 pt-8 border-t border-white/5"
                        >
                            <div>
                                <p className="text-3xl font-bold text-white">10k+</p>
                                <p className="text-sm text-slate-500">Active Traders</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">$2B+</p>
                                <p className="text-sm text-slate-500">Volume Tracked</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">4.9/5</p>
                                <p className="text-sm text-slate-500">User Rating</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side is handled by the 3D background positioning, 
                        but we can add a floating UI element here if needed */}
                    <div className="hidden lg:block h-[600px]"></div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 20 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/10 shadow-2xl transform-gpu perspective-1000"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl -z-10 rounded-full opacity-20" />
                        <div className="bg-[#0B0F19] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                            {/* Dashboard Header */}
                            <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="h-6 w-px bg-slate-800 mx-2" />
                                    <span className="text-sm font-medium text-slate-400">Dashboard</span>
                                    <span className="text-sm font-medium text-slate-600">Stats</span>
                                    <span className="text-sm font-medium text-slate-600">Journal</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                        +$1,240.50 Today
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 grid grid-cols-12 gap-6 h-[600px] overflow-hidden">
                                {/* Left Column - Stats & Chart */}
                                <div className="col-span-12 lg:col-span-8 space-y-6">
                                    {/* Top Stats Row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                                            <p className="text-xs text-slate-500 mb-1">Net P&L</p>
                                            <p className="text-2xl font-bold text-green-400">+$16,664.99</p>
                                            <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full w-[75%]" />
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                                            <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                                            <p className="text-2xl font-bold text-cyan-400">72%</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs">
                                                <span className="text-green-400">21 Wins</span>
                                                <span className="text-slate-600">|</span>
                                                <span className="text-red-400">6 Losses</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                                            <p className="text-xs text-slate-500 mb-1">Profit Factor</p>
                                            <p className="text-2xl font-bold text-purple-400">2.85</p>
                                            <p className="text-xs text-slate-500 mt-2">Avg Win: $374</p>
                                        </div>
                                    </div>

                                    {/* Main Chart Area */}
                                    <div className="h-80 bg-slate-800/30 rounded-xl border border-slate-800 p-4 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-medium text-slate-400">Equity Curve</h3>
                                            <div className="flex gap-2">
                                                {['1D', '1W', '1M', '3M', 'YTD'].map(t => (
                                                    <span key={t} className={`text-xs px-2 py-1 rounded ${t === '1M' ? 'bg-slate-700 text-white' : 'text-slate-600'}`}>{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Realistic Chart SVG */}
                                        <div className="relative h-64 w-full">
                                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 900 300">
                                                <defs>
                                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M0,250 C100,240 200,260 300,200 C400,140 500,180 600,120 C700,60 800,80 900,40"
                                                    fill="none" stroke="#06b6d4" strokeWidth="3" />
                                                <path d="M0,250 C100,240 200,260 300,200 C400,140 500,180 600,120 C700,60 800,80 900,40 V300 H0 Z"
                                                    fill="url(#chartGradient)" />

                                                {/* Data Points */}
                                                {[
                                                    { cx: 300, cy: 200 }, { cx: 600, cy: 120 }, { cx: 900, cy: 40 }
                                                ].map((pt, i) => (
                                                    <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#06b6d4" className="animate-pulse" />
                                                ))}
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Recent Trades */}
                                <div className="col-span-12 lg:col-span-4 bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                        <h3 className="font-medium text-slate-300">Recent Trades</h3>
                                        <button className="text-xs text-cyan-400 hover:text-cyan-300">View All</button>
                                    </div>
                                    <div className="flex-1 overflow-hidden relative">
                                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-900/50 to-transparent z-10" />
                                        <div className="space-y-1 p-2">
                                            {[
                                                { sym: "BTC/USDT", side: "Long", pnl: "+$450.00", roi: "+12.5%", status: "WIN" },
                                                { sym: "ETH/USDT", side: "Short", pnl: "+$120.50", roi: "+5.2%", status: "WIN" },
                                                { sym: "SOL/USDT", side: "Long", pnl: "-$45.00", roi: "-2.1%", status: "LOSS" },
                                                { sym: "MATIC/USDT", side: "Long", pnl: "+$890.00", roi: "+45.0%", status: "WIN" },
                                                { sym: "AVAX/USDT", side: "Short", pnl: "+$230.00", roi: "+8.4%", status: "WIN" },
                                                { sym: "DOT/USDT", side: "Long", pnl: "-$120.00", roi: "-5.6%", status: "LOSS" },
                                                { sym: "LINK/USDT", side: "Long", pnl: "+$340.00", roi: "+15.2%", status: "WIN" },
                                            ].map((trade, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1.5 h-8 rounded-full ${trade.status === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <div>
                                                            <p className="font-bold text-sm text-white">{trade.sym}</p>
                                                            <p className={`text-xs ${trade.side === 'Long' ? 'text-green-400' : 'text-red-400'}`}>{trade.side}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold text-sm ${trade.status === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{trade.pnl}</p>
                                                        <p className="text-xs text-slate-500">{trade.roi}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            Advanced Tools for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                                Professional Traders
                            </span>
                        </motion.h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Everything you need to analyze your performance and find your edge in the market.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            title="AI Trade Analysis"
                            description="Get instant feedback on your trades with our AI-powered analysis engine. Identify mistakes and improve your strategy."
                            icon={Cpu}
                            delay={0}
                        />
                        <FeatureCard
                            title="Automated Sync"
                            description="Connect your exchange API keys and let us handle the rest. Trades are imported automatically in real-time."
                            icon={Zap}
                            delay={0.1}
                        />
                        <FeatureCard
                            title="Advanced Metrics"
                            description="Deep dive into your performance with over 50+ metrics including Win Rate, Profit Factor, and Expectancy."
                            icon={BarChart2}
                            delay={0.2}
                        />
                        <FeatureCard
                            title="Multi-Exchange"
                            description="Manage all your accounts in one place. Support for Binance, Bybit, KuCoin, and more."
                            icon={Globe}
                            delay={0.3}
                        />
                        <FeatureCard
                            title="Risk Management"
                            description="Track your R-multiple and ensure you're sticking to your risk management rules."
                            icon={Shield}
                            delay={0.4}
                        />
                        <FeatureCard
                            title="Custom Layouts"
                            description="Customize your dashboard to show exactly what matters to you. Drag and drop widgets with ease."
                            icon={Layout}
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <PricingSection />

            {/* Community Section */}
            <section className="relative z-10 py-32 border-t border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-8"
                    >
                        <Users className="w-4 h-4" /> Trusted by the Community
                    </motion.div>

                    <h2 className="text-4xl font-bold">Join the Elite Traders</h2>
                </div>

                <div className="relative w-full overflow-hidden mask-gradient-x">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex gap-8 w-max pl-8"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 40,
                            ease: "linear",
                            repeat: Infinity
                        }}
                    >
                        {[...Array(2)].map((_, setIndex) => (
                            <div key={setIndex} className="flex gap-8">
                                {[
                                    { name: "Alex Thompson", role: "Pro Trader", text: "This journal completely changed how I view my trading. The AI insights helped me plug leaks I didn't even know I had." },
                                    { name: "Sarah Chen", role: "Crypto Analyst", text: "The 3D visualization is a game changer. Being able to see my trade clusters in a spatial view helps me understand market structure like never before." },
                                    { name: "Mike Ross", role: "Day Trader", text: "Finally, a journal that keeps up with the speed of crypto. The automated sync is flawless and the metrics are exactly what I need." },
                                    { name: "Elena Rodriguez", role: "Portfolio Manager", text: "I manage multiple accounts across 5 exchanges. CryptoJournal brings everything into one beautiful, unified dashboard." }
                                ].map((testimonial, i) => (
                                    <motion.div
                                        key={`${setIndex}-${i}`}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="w-[400px] p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left hover:border-cyan-500/30 hover:bg-slate-900/60 transition-colors duration-300 group cursor-default flex-shrink-0"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 group-hover:from-cyan-500 group-hover:to-blue-600 transition-colors duration-300" />
                                            <div>
                                                <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{testimonial.name}</p>
                                                <p className="text-sm text-slate-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 group-hover:text-slate-300 transition-colors">"{testimonial.text}"</p>
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Ready to Master <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                            The Markets?
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Join thousands of traders who are already using CryptoJournal to improve their performance.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        Start Your Journey <ChevronRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">CryptoJournal</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2024 CryptoJournal. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Discord</a>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
