import mongoose, { Document, Schema } from 'mongoose';

export interface IJournal extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    date: Date;
    tags?: string[];
    linkedTrade?: mongoose.Schema.Types.ObjectId;
    images?: string[];
    mood?: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'BAD' | 'TERRIBLE';
}

const journalSchema = new Schema<IJournal>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    tags: [{
        type: String,
    }],
    linkedTrade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    },
    images: [{
        type: String,
    }],
    mood: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE'],
    },
}, {
    timestamps: true,
});

const Journal = mongoose.model<IJournal>('Journal', journalSchema);

export default Journal;
