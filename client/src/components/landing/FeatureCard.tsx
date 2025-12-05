import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: any;
    delay: number;
}

const FeatureCard = ({ title, description, icon: Icon, delay }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full p-8 rounded-xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="w-24 h-24 text-cyan-500" />
                </div>

                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{description}</p>

                <div className="mt-6 flex items-center text-sm text-cyan-500 font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    Learn more <span className="ml-1">→</span>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
