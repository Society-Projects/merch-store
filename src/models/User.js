import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        googleAccountIdentifier: { type: String, unique: true },
        avatar: { type: String },
        role: { type: String, enum: ['EB', 'CORE', 'MEMBER'], default: 'MEMBER' },
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);