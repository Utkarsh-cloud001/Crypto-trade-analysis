"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tradeController_1 = require("../controllers/tradeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').post(authMiddleware_1.protect, tradeController_1.createTrade).get(authMiddleware_1.protect, tradeController_1.getTrades);
router.get('/stats', authMiddleware_1.protect, tradeController_1.getTradeStats);
router.route('/:id').get(authMiddleware_1.protect, tradeController_1.getTradeById).put(authMiddleware_1.protect, tradeController_1.updateTrade).delete(authMiddleware_1.protect, tradeController_1.deleteTrade);
exports.default = router;
