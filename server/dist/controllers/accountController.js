"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.addTransaction = exports.getTransactions = exports.deleteAccount = exports.updateAccount = exports.createAccount = exports.getAccounts = void 0;
const Account_1 = __importDefault(require("../models/Account"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
// @desc    Get all accounts for user
// @route   GET /api/accounts
// @access  Private
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = yield Account_1.default.find({ user: req.user._id });
        // If no accounts exist, create a default one
        if (accounts.length === 0) {
            const defaultAccount = yield Account_1.default.create({
                user: req.user._id,
                name: 'Default Account',
                isPrimary: true,
                balance: 0
            });
            return res.json([defaultAccount]);
        }
        res.json(accounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAccounts = getAccounts;
// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, balance, isPrimary } = req.body;
        if (isPrimary) {
            // Unset other primary accounts
            yield Account_1.default.updateMany({ user: req.user._id, isPrimary: true }, { isPrimary: false });
        }
        const account = yield Account_1.default.create({
            user: req.user._id,
            name,
            balance: balance || 0,
            isPrimary: isPrimary || false
        });
        res.status(201).json(account);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createAccount = createAccount;
// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, isPrimary } = req.body;
        const account = yield Account_1.default.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (isPrimary) {
            yield Account_1.default.updateMany({ user: req.user._id, isPrimary: true }, { isPrimary: false });
        }
        account.name = name || account.name;
        if (isPrimary !== undefined)
            account.isPrimary = isPrimary;
        yield account.save();
        res.json(account);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateAccount = updateAccount;
// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_1.default.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Prevent deleting the last account
        const accountCount = yield Account_1.default.countDocuments({ user: req.user._id });
        if (accountCount <= 1) {
            return res.status(400).json({ message: 'Cannot delete the only account' });
        }
        yield Account_1.default.findByIdAndDelete(req.params.id);
        yield Transaction_1.default.deleteMany({ account: req.params.id });
        // TODO: Handle trades associated with this account (reassign or delete)
        res.json({ message: 'Account deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteAccount = deleteAccount;
// @desc    Get transactions for account
// @route   GET /api/accounts/:id/transactions
// @access  Private
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield Transaction_1.default.find({ account: req.params.id }).sort({ date: -1 });
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTransactions = getTransactions;
// @desc    Add transaction
// @route   POST /api/accounts/:id/transactions
// @access  Private
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, amount, date, note } = req.body;
        const account = yield Account_1.default.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const transaction = yield Transaction_1.default.create({
            account: req.params.id,
            type,
            amount,
            date: date || new Date(),
            note
        });
        // Update account balance
        if (type === 'DEPOSIT') {
            account.balance += Number(amount);
        }
        else {
            account.balance -= Number(amount);
        }
        yield account.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addTransaction = addTransaction;
// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.default.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const account = yield Account_1.default.findById(transaction.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Revert balance change
        if (transaction.type === 'DEPOSIT') {
            account.balance -= transaction.amount;
        }
        else {
            account.balance += transaction.amount;
        }
        yield account.save();
        yield Transaction_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTransaction = deleteTransaction;
