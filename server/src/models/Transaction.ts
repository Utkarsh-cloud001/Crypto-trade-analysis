import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    account: mongoose.Schema.Types.ObjectId;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    amount: number;
    date: Date;
    note?: string;
}

const transactionSchema = new Schema<ITransaction>({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: { type: String, enum: ['DEPOSIT', 'WITHDRAWAL'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
