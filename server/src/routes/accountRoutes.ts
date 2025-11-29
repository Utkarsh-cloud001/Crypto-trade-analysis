import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getTransactions,
    addTransaction,
    deleteTransaction
} from '../controllers/accountController';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAccounts)
    .post(createAccount);

router.route('/:id')
    .put(updateAccount)
    .delete(deleteAccount);

router.route('/:id/transactions')
    .get(getTransactions)
    .post(addTransaction);

router.route('/transactions/:id')
    .delete(deleteTransaction);

export default router;
