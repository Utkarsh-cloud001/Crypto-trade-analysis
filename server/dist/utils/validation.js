"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters" }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.tradeSchema = zod_1.z.object({
    account: zod_1.z.string().optional(),
    pair: zod_1.z.string().min(2),
    type: zod_1.z.enum(['LONG', 'SHORT']),
    entryPrice: zod_1.z.number().positive(),
    exitPrice: zod_1.z.number().positive().optional(),
    amount: zod_1.z.number().positive(),
    leverage: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(['OPEN', 'CLOSED']).optional(),
    notes: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    entryDate: zod_1.z.string().datetime().optional(),
    method: zod_1.z.string().optional(),
    stopLoss: zod_1.z.number().positive().optional(),
    takeProfit: zod_1.z.number().positive().optional(),
    fees: zod_1.z.number().min(0).optional(),
    screenshot: zod_1.z.string().optional(),
});
