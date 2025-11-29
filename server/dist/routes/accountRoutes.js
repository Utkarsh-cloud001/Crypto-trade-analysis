"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accountController_1 = require("../controllers/accountController");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/')
    .get(accountController_1.getAccounts)
    .post(accountController_1.createAccount);
router.route('/:id')
    .put(accountController_1.updateAccount)
    .delete(accountController_1.deleteAccount);
router.route('/:id/transactions')
    .get(accountController_1.getTransactions)
    .post(accountController_1.addTransaction);
router.route('/transactions/:id')
    .delete(accountController_1.deleteTransaction);
exports.default = router;
