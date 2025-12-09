import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(12, { message: "Password must be at least 12 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const tradeSchema = z.object({
    account: z.string().optional(),
    pair: z.string().min(2),
    type: z.enum(['LONG', 'SHORT']),
    entryPrice: z.number().positive(),
    exitPrice: z.number().positive().optional(),
    amount: z.number().positive(),
    leverage: z.number().positive().optional(),
    status: z.enum(['OPEN', 'CLOSED']).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    entryDate: z.string().datetime().optional(),
    method: z.string().optional(),
    stopLoss: z.number().positive().optional(),
    takeProfit: z.number().positive().optional(),
    fees: z.number().min(0).optional(),
    screenshot: z.string().optional(),
});
