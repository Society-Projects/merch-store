import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    selectedPosition: { type: String, required: false },
    userInputValues: { type: Map, of: String, required: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    orderId: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    paymentScreenshot: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'verified', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
