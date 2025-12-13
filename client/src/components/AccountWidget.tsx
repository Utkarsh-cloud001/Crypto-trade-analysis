import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { useAccount } from '../context/AccountContext';
import { useCurrency } from '../context/CurrencyContext';
import AccountModal from './AccountModal';

const AccountWidget = () => {
    const { selectedAccount, loading } = useAccount();
    const { formatCurrency } = useCurrency();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="p-4 text-slate-500 text-sm">Loading...</div>;
    if (!selectedAccount) return null;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-400">Account</p>
                        <p className="text-lg font-bold text-white">{selectedAccount.name}</p>
                    </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-slate-500">Balance</span>
                    <span className="text-lg font-bold text-blue-400">
                        {formatCurrency(selectedAccount.balance)}
                    </span>
                </div>
            </button>

            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default AccountWidget;
