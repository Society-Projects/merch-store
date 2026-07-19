import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    selectedPosition: { type: String, required: false },
    userInputValues: { type: Map, of: String, required: false }
}, { _id: false });

const orderDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNo: { type: String, required: true },
    college: { type: String, required: false },
    notes: { type: String, required: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    orderId: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    details: { type: orderDetailsSchema, required: true },
    paymentScreenshot: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'verified', 'packed', 'ready', 'completed'], 
        default: 'pending' 
    }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
