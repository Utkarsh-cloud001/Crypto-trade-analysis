import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    pair: string;
    type: 'LONG' | 'SHORT';
    method?: string;
    entryPrice: number;
    exitPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    amount: number;
    leverage: number;
    status: 'OPEN' | 'CLOSED';
    entryDate: Date;
    exitDate?: Date;
    pnl?: number;
    notes?: string;
    tags?: string[];
    screenshot?: string;
    fees?: number;
}

const tradeSchema = new Schema<ITrade>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
    pair: {
        type: String,
        required: true,
        uppercase: true,
    },
    type: {
        type: String,
        enum: ['LONG', 'SHORT'],
        required: true,
    },
    method: {
        type: String,
    },
    entryPrice: {
        type: Number,
        required: true,
    },
    exitPrice: {
        type: Number,
    },
    stopLoss: {
        type: Number,
    },
    takeProfit: {
        type: Number,
    },
    amount: {
        type: Number,
        required: true,
    },
    leverage: {
        type: Number,
        default: 1,
    },
    fees: {
        type: Number,
        default: 0,
    },
    pnl: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN',
    },
    entryDate: {
        type: Date,
        default: Date.now,
    },
    exitDate: {
        type: Date,
    },
    notes: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    screenshot: {
        type: String,
    },
}, {
    timestamps: true,
});

const Trade = mongoose.model<ITrade>('Trade', tradeSchema);

export default Trade;
