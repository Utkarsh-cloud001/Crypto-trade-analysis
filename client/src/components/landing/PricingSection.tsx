import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard = ({
    title,
    price,
    features,
    recommended = false,
    delay,
    icon: Icon
}: {
    title: string;
    price: string;
    features: string[];
    recommended?: boolean;
    delay: number;
    icon: any;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{
            y: -10,
            scale: 1.02,
            boxShadow: recommended
                ? '0 0 60px rgba(6,182,212,0.3)'
                : '0 0 40px rgba(6,182,212,0.15)'
        }}
        className={`relative p-8 rounded-2xl border ${recommended
                ? 'bg-slate-900/60 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900/40 border-slate-800'
            } backdrop-blur-sm flex flex-col group hover:border-cyan-500/50 transition-all duration-300 cursor-default`}
    >
        {recommended && (
            <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Most Popular
            </motion.div>
        )}

        <div className="mb-8">
            <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${recommended ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-800'
                    } group-hover:scale-110 transition-all duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon className={`w-6 h-6 ${recommended ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'} transition-colors duration-300`} />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{title}</h3>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{price}</span>
                {price !== 'Free' && <span className="text-slate-500 group-hover:text-slate-400 transition-colors duration-300">/month</span>}
            </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
                <motion.li
                    key={i}
                    className="flex items-start gap-3 text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Check className={`w-5 h-5 flex-shrink-0 ${recommended ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors duration-300`} />
                    <span>{feature}</span>
                </motion.li>
            ))}
        </ul>

        <Link
            to="/register"
            className={`w-full py-3 rounded-xl font-bold text-center transition-all duration-300 ${recommended
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.05]'
                    : 'bg-white/5 text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 border border-white/10 hover:border-cyan-500/50'
                }`}
        >
            {price === 'Free' ? 'Get Started' : 'Start Free Trial'}
        </Link>
    </motion.div>
);

const PricingSection = () => {
    return (
        <section id="pricing" className="relative z-10 py-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Simple Pricing for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                            Serious Traders
                        </span>
                    </motion.h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Start for free and upgrade as you grow. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <PricingCard
                        title="Starter"
                        price="Free"
                        icon={Zap}
                        delay={0}
                        features={[
                            "Manual Trade Entry",
                            "Basic Analytics Dashboard",
                            "100 Trades / Month",
                            "Community Support",
                            "Mobile Friendly"
                        ]}
                    />
                    <PricingCard
                        title="Pro"
                        price="$29"
                        icon={Star}
                        recommended={true}
                        delay={0.1}
                        features={[
                            "Everything in Starter",
                            "Automated Exchange Sync",
                            "Unlimited Trades",
                            "Advanced AI Insights",
                            "Custom Widgets",
                            "Priority Support"
                        ]}
                    />
                    <PricingCard
                        title="Elite"
                        price="$99"
                        icon={Crown}
                        delay={0.2}
                        features={[
                            "Everything in Pro",
                            "1-on-1 Strategy Calls",
                            "Custom API Access",
                            "White Label Reports",
                            "Early Access to Features",
                            "Dedicated Account Manager"
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
