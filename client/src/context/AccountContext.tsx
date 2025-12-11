import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

export interface Account {
    _id: string;
    name: string;
    isPrimary: boolean;
    balance: number;
    currency: string;
}

interface AccountContextType {
    accounts: Account[];
    selectedAccount: Account | null;
    selectAccount: (id: string) => void;
    refreshAccounts: () => Promise<void>;
    loading: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        // Only fetch if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/accounts');
            let accountsData = res.data;

            // If no accounts exist, create a default demo account locally
            if (accountsData.length === 0) {
                const demoAccount: Account = {
                    _id: 'demo-account',
                    name: 'Demo Account',
                    isPrimary: true,
                    balance: 10000,
                    currency: 'USD'
                };
                accountsData = [demoAccount];
            }

            setAccounts(accountsData);

            // Check localStorage for previously selected account
            const savedAccountId = localStorage.getItem('selectedAccountId');

            if (savedAccountId && accountsData.find((a: Account) => a._id === savedAccountId)) {
                // Restore saved selection
                const savedAccount = accountsData.find((a: Account) => a._id === savedAccountId);
                setSelectedAccount(savedAccount || accountsData[0]);
            } else if (!selectedAccount && accountsData.length > 0) {
                // If no account selected, select primary or first
                const primary = accountsData.find((a: Account) => a.isPrimary);
                const selected = primary || accountsData[0];
                setSelectedAccount(selected);
                localStorage.setItem('selectedAccountId', selected._id);
            } else if (selectedAccount) {
                // Update selected account data
                const updated = accountsData.find((a: Account) => a._id === selectedAccount._id);
                if (updated) {
                    setSelectedAccount(updated);
                }
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            // Even if API fails, provide a demo account
            const demoAccount: Account = {
                _id: 'demo-account-fallback',
                name: 'Demo Account',
                isPrimary: true,
                balance: 10000,
                currency: 'USD'
            };
            setAccounts([demoAccount]);
            setSelectedAccount(demoAccount);
            localStorage.setItem('selectedAccountId', demoAccount._id);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const selectAccount = (id: string) => {
        const account = accounts.find(a => a._id === id);
        if (account) {
            setSelectedAccount(account);
            localStorage.setItem('selectedAccountId', id);
        }
    };

    return (
        <AccountContext.Provider value={{
            accounts,
            selectedAccount,
            selectAccount,
            refreshAccounts: fetchAccounts,
            loading
        }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};
