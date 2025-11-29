"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const featureController_1 = require("../controllers/featureController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').get(featureController_1.getFeatures).post(authMiddleware_1.protect, featureController_1.createFeature);
router.post('/:id/vote', authMiddleware_1.protect, featureController_1.voteFeature);
router.delete('/:id/vote', authMiddleware_1.protect, featureController_1.unvoteFeature);
exports.default = router;
