import "#src/config/env.js";

import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        throw new Error(`Error connecting to database: ${error.message}`);
    }
};