import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const Terms = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
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
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Privacy</h1>
                        <p className="text-slate-400 text-lg">Last updated: November 29, 2024</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Section title="1. Terms of Service">
                            <p>
                                By accessing and using CryptoJournal, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                            <p>
                                We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of any changes.
                            </p>
                        </Section>

                        <Section title="2. User Accounts">
                            <p>
                                You are responsible for maintaining the security of your account and password. CryptoJournal cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                            </p>
                            <p>
                                You are responsible for all content posted and activity that occurs under your account.
                            </p>
                        </Section>

                        <Section title="3. Privacy Policy">
                            <p>
                                Your privacy is important to us. It is CryptoJournal's policy to respect your privacy regarding any information we may collect from you across our website.
                            </p>
                            <p>
                                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                            </p>
                        </Section>

                        <Section title="4. Data Security">
                            <p>
                                We take data security seriously. Your exchange API keys are encrypted using industry-standard protocols. We never ask for withdrawal permissions on your API keys.
                            </p>
                            <p>
                                While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                            </p>
                        </Section>

                        <Section title="5. Disclaimer">
                            <p>
                                CryptoJournal is a journaling and analysis tool. We do not provide financial advice. Trading cryptocurrencies involves significant risk, and you should only trade with money you can afford to lose.
                            </p>
                            <p>
                                Past performance is not indicative of future results.
                            </p>
                        </Section>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
