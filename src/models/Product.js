import mongoose from 'mongoose';

const userInputSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        isImageInput: { type: Boolean, required: false },
        isText: { type: Boolean, required: true, default: true },
        isImage: { type: Boolean, required: true, default: false },
        isMenu: { type: Boolean, required: true, default: false },
        menuOptions: { type: [String], required: false, default: [] },
        isRequired: { type: Boolean, required: true, default: false },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },

        isVisible: { type: Boolean, default: true },
        positions: {
            type: [{
                type: String,
                enum: ["EB", "CORE", "MEMBER"]
            }],
            default: ["EB", "CORE", "MEMBER"]
        },

        price: { type: Number, required: true, default: 100 },
        image: { type: String, required: false },

        userInputs: { type: [userInputSchema], required: false },
    },
    { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);