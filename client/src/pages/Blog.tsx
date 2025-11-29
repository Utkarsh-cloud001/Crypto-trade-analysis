import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import Hero3D from '../components/landing/Hero3D';

const BlogPost = ({ title, excerpt, date, readTime, category, image, delay }: { title: string, excerpt: string, date: string, readTime: string, category: string, image: string, delay: number }) => (
    <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
    >
        <div className="h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    {category}
                </span>
            </div>
        </div>

        <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {date}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                {excerpt}
            </p>

            <Link to="#" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    </motion.article>
);

const Blog = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
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
                    <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Insights</span>
                        </motion.h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Expert analysis, market updates, and educational content to help you become a better trader.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <BlogPost
                            title="Mastering Risk Management in Crypto"
                            excerpt="Learn the essential rules of position sizing and stop-loss placement to protect your capital in volatile markets."
                            date="Nov 28, 2024"
                            readTime="5 min read"
                            category="Education"
                            image="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800"
                            delay={0}
                        />
                        <BlogPost
                            title="The Psychology of FOMO"
                            excerpt="Why do we chase green candles? Understanding the psychological triggers behind Fear Of Missing Out and how to control them."
                            date="Nov 25, 2024"
                            readTime="7 min read"
                            category="Psychology"
                            image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                            delay={0.1}
                        />
                        <BlogPost
                            title="Technical Analysis 101: Support & Resistance"
                            excerpt="A deep dive into the most fundamental concept of technical analysis. How to identify key levels and trade them effectively."
                            date="Nov 22, 2024"
                            readTime="10 min read"
                            category="Technical Analysis"
                            image="https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800"
                            delay={0.2}
                        />
                        <BlogPost
                            title="Bitcoin Halving: What You Need to Know"
                            excerpt="Analyzing historical data to understand the potential impact of the upcoming Bitcoin halving event on market cycles."
                            date="Nov 18, 2024"
                            readTime="6 min read"
                            category="Market Analysis"
                            image="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
                            delay={0.3}
                        />
                        <BlogPost
                            title="Building a Trading System That Fits You"
                            excerpt="There is no one-size-fits-all strategy. How to develop a trading system that aligns with your personality and lifestyle."
                            date="Nov 15, 2024"
                            readTime="8 min read"
                            category="Strategy"
                            image="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80&w=800"
                            delay={0.4}
                        />
                        <BlogPost
                            title="DeFi vs. CeFi: Where Should You Trade?"
                            excerpt="Comparing the pros and cons of Decentralized and Centralized exchanges. Which one offers better security and liquidity?"
                            date="Nov 10, 2024"
                            readTime="5 min read"
                            category="Education"
                            image="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
                            delay={0.5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
