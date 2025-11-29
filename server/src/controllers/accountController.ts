import { Request, Response } from 'express';
import Account from '../models/Account';
import Transaction from '../models/Transaction';
import Trade from '../models/Trade';

// @desc    Get all accounts for user
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (req: Request, res: Response) => {
    try {
        const accounts = await Account.find({ user: req.user._id });

        // If no accounts exist, create a default one
        if (accounts.length === 0) {
            const defaultAccount = await Account.create({
                user: req.user._id,
                name: 'Default Account',
                isPrimary: true,
                balance: 0
            });
            return res.json([defaultAccount]);
        }

        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (req: Request, res: Response) => {
    try {
        const { name, balance, isPrimary } = req.body;

        if (isPrimary) {
            // Unset other primary accounts
            await Account.updateMany(
                { user: req.user._id, isPrimary: true },
                { isPrimary: false }
            );
        }

        const account = await Account.create({
            user: req.user._id,
            name,
            balance: balance || 0,
            isPrimary: isPrimary || false
        });

        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (req: Request, res: Response) => {
    try {
        const { name, isPrimary } = req.body;
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (isPrimary) {
            await Account.updateMany(
                { user: req.user._id, isPrimary: true },
                { isPrimary: false }
            );
        }

        account.name = name || account.name;
        if (isPrimary !== undefined) account.isPrimary = isPrimary;

        await account.save();
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Prevent deleting the last account
        const accountCount = await Account.countDocuments({ user: req.user._id });
        if (accountCount <= 1) {
            return res.status(400).json({ message: 'Cannot delete the only account' });
        }

        await Account.findByIdAndDelete(req.params.id);
        await Transaction.deleteMany({ account: req.params.id as any });

        // TODO: Handle trades associated with this account (reassign or delete)

        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get transactions for account
// @route   GET /api/accounts/:id/transactions
// @access  Private
export const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ account: req.params.id as any }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Add transaction
// @route   POST /api/accounts/:id/transactions
// @access  Private
export const addTransaction = async (req: Request, res: Response) => {
    try {
        const { type, amount, date, note } = req.body;
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const transaction = await Transaction.create({
            account: req.params.id as any,
            type,
            amount,
            date: date || new Date(),
            note
        });

        // Update account balance
        if (type === 'DEPOSIT') {
            account.balance += Number(amount);
        } else {
            account.balance -= Number(amount);
        }
        await account.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const account = await Account.findById(transaction.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Revert balance change
        if (transaction.type === 'DEPOSIT') {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }
        await account.save();

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
