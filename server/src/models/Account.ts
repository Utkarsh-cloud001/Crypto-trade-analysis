import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    isPrimary: boolean;
    balance: number; // Current cached balance
    currency: string;
}

const accountSchema = new Schema<IAccount>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
}, { timestamps: true });

export default mongoose.model<IAccount>('Account', accountSchema);
