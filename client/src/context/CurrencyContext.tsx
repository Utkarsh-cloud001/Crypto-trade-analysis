import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
    currency: string;
    rate: number;
    formatCurrency: (amount: number) => string;
    convertCurrency: (amount: number) => number;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates cache to minimize API calls
const RATES_CACHE: { [key: string]: { rate: number; timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [currency, setCurrency] = useState('USD');
    const [rate, setRate] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Update currency when user settings change
    useEffect(() => {
        if (user?.settings?.currency) {
            setCurrency(user.settings.currency);
        } else {
            setCurrency('USD');
        }
    }, [user?.settings?.currency]);

    // Fetch exchange rate when currency changes
    useEffect(() => {
        const fetchRate = async () => {
            if (currency === 'USD') {
                setRate(1);
                return;
            }

            // Check cache
            const cached = RATES_CACHE[currency];
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setRate(cached.rate);
                return;
            }

            setIsLoading(true);
            try {
                // Using free exchangerate-api.com
                const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
                const data = await res.json();
                const newRate = data.rates[currency];

                if (newRate) {
                    setRate(newRate);
                    RATES_CACHE[currency] = { rate: newRate, timestamp: Date.now() };
                }
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
                // Fallback to 1 if failed
                setRate(1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();
    }, [currency]);

    const convertCurrency = (amount: number): number => {
        return amount * rate;
    };

    const formatCurrency = (amount: number): string => {
        const converted = convertCurrency(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, rate, formatCurrency, convertCurrency, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
