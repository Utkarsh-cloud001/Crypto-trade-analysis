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
            setAccounts(res.data);

            // If no account selected, select primary or first
            if (!selectedAccount && res.data.length > 0) {
                const primary = res.data.find((a: Account) => a.isPrimary);
                setSelectedAccount(primary || res.data[0]);
            } else if (selectedAccount) {
                // Update selected account data
                const updated = res.data.find((a: Account) => a._id === selectedAccount._id);
                if (updated) setSelectedAccount(updated);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const selectAccount = (id: string) => {
        const account = accounts.find(a => a._id === id);
        if (account) setSelectedAccount(account);
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
