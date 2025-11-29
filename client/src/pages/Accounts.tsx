import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useAccount } from '../context/AccountContext';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Transaction {
    _id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    amount: number;
    date: string;
    note: string;
}

const AccountsPage = () => {
    const { selectedAccount, accounts, selectAccount, refreshAccounts } = useAccount();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editedName, setEditedName] = useState('');
    const [showNewAccount, setShowNewAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newTransaction, setNewTransaction] = useState<{
        type: 'DEPOSIT' | 'WITHDRAWAL';
        amount: string;
        date: string;
        note: string;
    } | null>(null);

    useEffect(() => {
        if (selectedAccount) {
            fetchTransactions(selectedAccount._id);
            setEditedName(selectedAccount.name);
        }
    }, [selectedAccount]);

    const fetchTransactions = async (accountId: string) => {
        try {
            const res = await api.get(`/accounts/${accountId}/transactions`);
            setTransactions(res.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleSaveAccount = async () => {
        if (!selectedAccount) return;
        try {
            await api.put(`/accounts/${selectedAccount._id}`, {
                name: editedName,
                isPrimary: selectedAccount.isPrimary
            });
            await refreshAccounts();
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    const handleCreateAccount = async () => {
        try {
            const res = await api.post('/accounts', {
                name: newAccountName,
                balance: 0,
                isPrimary: accounts.length === 0
            });
            await refreshAccounts();
            selectAccount(res.data._id);
            setShowNewAccount(false);
            setNewAccountName('');
        } catch (error) {
            console.error('Failed to create account:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (!selectedAccount) return;
        if (!window.confirm('Are you sure you want to delete this account? All transactions will be lost.')) return;

        try {
            await api.delete(`/accounts/${selectedAccount._id}`);
            await refreshAccounts();
            const remaining = accounts.filter(a => a._id !== selectedAccount._id);
            if (remaining.length > 0) {
                selectAccount(remaining[0]._id);
            }
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account. You cannot delete the only account.');
        }
    };

    const handleAddTransaction = async () => {
        if (!selectedAccount || !newTransaction) return;
        try {
            await api.post(`/accounts/${selectedAccount._id}/transactions`, {
                ...newTransaction,
                amount: parseFloat(newTransaction.amount)
            });
            await fetchTransactions(selectedAccount._id);
            await refreshAccounts();
            setNewTransaction(null);
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!selectedAccount) return;
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            await fetchTransactions(selectedAccount._id);
            await refreshAccounts();
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    if (!selectedAccount) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Account & Transactions
                </h1>
                <p className="text-slate-400 mt-2">Manage your trading accounts and transactions</p>
            </div>

            {/* Account Info Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Account</label>
                        <select
                            value={selectedAccount._id}
                            onChange={(e) => selectAccount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        >
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <label className="text-sm font-medium text-slate-400 mb-2">Primary</label>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAccount.isPrimary ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                            {selectedAccount.isPrimary && <Check className="w-6 h-6" />}
                        </div>
                    </div>

                    <div className="text-right">
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Account Balance</label>
                        <div className="text-3xl font-bold text-blue-400">
                            ${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                {/* Edit Name Section */}
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Name</label>
                        <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Account Name"
                        />
                    </div>
                    <Button onClick={handleSaveAccount} disabled={editedName === selectedAccount.name}>
                        Update Name
                    </Button>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-slate-300 mb-4">Transactions</h3>

                <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-800">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Note</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.map(tx => (
                                <tr key={tx._id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-300">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-white">
                                        ${tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-400">
                                        {tx.note || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDeleteTransaction(tx._id)}
                                            className="text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Add Transaction Row */}
                            {newTransaction ? (
                                <tr className="bg-blue-500/5">
                                    <td className="px-4 py-3">
                                        <select
                                            value={newTransaction.type}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'DEPOSIT' | 'WITHDRAWAL' })}
                                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                        >
                                            <option value="DEPOSIT">DEPOSIT</option>
                                            <option value="WITHDRAWAL">WITHDRAWAL</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-24"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            placeholder="Note..."
                                            value={newTransaction.note}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full"
                                        />
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 justify-end">
                                        <button onClick={handleAddTransaction} className="text-green-400 hover:text-green-300">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setNewTransaction(null)} className="text-red-400 hover:text-red-300">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setNewTransaction({ type: 'DEPOSIT', amount: '', date: new Date().toISOString().split('T')[0], note: '' })}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
                                        >
                                            <Plus className="w-4 h-4" /> Add Transaction
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Actions */}
            <div className="flex gap-4">
                <Button onClick={handleDeleteAccount} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none">
                    Delete Account
                </Button>
                {showNewAccount ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            placeholder="New Account Name"
                            className="w-48"
                        />
                        <Button onClick={handleCreateAccount} disabled={!newAccountName}>Create</Button>
                        <button onClick={() => setShowNewAccount(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <Button onClick={() => setShowNewAccount(true)} className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-none">
                        New Account
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AccountsPage;
