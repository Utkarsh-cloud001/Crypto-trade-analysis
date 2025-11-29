import mongoose, { Document, Schema } from 'mongoose';

export interface IFeature extends Document {
    title: string;
    description: string;
    category: 'feature' | 'announcement';
    votes: number;
    status: 'pending' | 'in-progress' | 'completed';
    voters: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const featureSchema = new Schema<IFeature>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['feature', 'announcement'],
            default: 'feature',
        },
        votes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        voters: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
featureSchema.index({ category: 1, votes: -1 });

const Feature = mongoose.model<IFeature>('Feature', featureSchema);

export default Feature;
