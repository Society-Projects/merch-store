import mongoose from 'mongoose';

const deviceInfoSchema = new mongoose.Schema(
    {
        browser: { type: String },
        browserVersion: { type: String },
        os: { type: String },
        osVersion: { type: String },
        device: { type: String },
        vendor: { type: String },
        model: { type: String },
    },
    { _id: false }
);

const sessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        hash: { type: String, required: true },
        expiresAt: { type: Date, required: true },

        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        deviceInfo: { type: deviceInfoSchema },
    },
    { timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);