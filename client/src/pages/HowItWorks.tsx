import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Database, BarChart2, Zap } from 'lucide-react';
import Hero3D from '../components/landing/Hero3D';

const Step = ({ number, title, description, icon: Icon, delay }: { number: string, title: string, description: string, icon: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="relative flex gap-8 items-start group"
    >
        <div className="hidden md:flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors z-10">
                <span className="text-xl font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">{number}</span>
            </div>
            <div className="w-px h-full bg-slate-800 my-4 group-last:hidden" />
        </div>

        <div className="flex-1 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{description}</p>
        </div>
    </motion.div>
);

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <Hero3D />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            CryptoJournal
                        </span>
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Works</span>
                        </motion.h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Mastering your trading psychology has never been easier. Follow these simple steps to start your journey.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Step
                            number="01"
                            title="Connect Your Exchange"
                            description="Securely connect your exchange accounts using read-only API keys. We support Binance, Bybit, KuCoin, and more. Your data is encrypted and safe."
                            icon={Database}
                            delay={0.1}
                        />
                        <Step
                            number="02"
                            title="Automatic Sync"
                            description="We automatically import your trade history and keep it updated in real-time. No more manual entry or messy spreadsheets."
                            icon={Zap}
                            delay={0.2}
                        />
                        <Step
                            number="03"
                            title="Analyze Performance"
                            description="Get deep insights into your trading behavior. View your equity curve, win rate, profit factor, and identify your best setups."
                            icon={BarChart2}
                            delay={0.3}
                        />
                        <Step
                            number="04"
                            title="Journal & Improve"
                            description="Add notes, tags, and screenshots to your trades. Review your mistakes and refine your strategy to become a profitable trader."
                            icon={TrendingUp}
                            delay={0.4}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 text-center"
                    >
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1"
                        >
                            Start Your Journey <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
