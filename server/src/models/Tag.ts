import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
    name: string;
    category: string;
    description?: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}

const tagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
tagSchema.index({ user: 1, name: 1 }, { unique: true });

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
