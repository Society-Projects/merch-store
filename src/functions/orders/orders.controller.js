import crypto from "crypto";
import { Order } from "#src/models/Order.js";
import { Product } from "#src/models/Product.js";
import ApiResponse from "#src/classes/ApiResponse.js";

// Helper to generate a unique human-readable order ID
const generateOrderId = () => {
    return `ORD-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

export const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, paymentScreenshot, notes } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json(new ApiResponse(400, "Items array is required"));
        }

        if (!totalPrice || isNaN(totalPrice)) {
            return res.status(400).json(new ApiResponse(400, "Invalid total price"));
        }

        if (!paymentScreenshot) {
            return res.status(400).json(new ApiResponse(400, "Payment proof screenshot is required"));
        }

        if (!req.user) {
            return res.status(401).json(new ApiResponse(401, "User authentication required"));
        }

        // Validate items and compute price on backend
        let calculatedPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            if (!item.product) {
                return res.status(400).json(new ApiResponse(400, "Product ID is required for all items"));
            }

            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json(new ApiResponse(404, `Product not found: ${item.product}`));
            }

            if (!dbProduct.isVisible) {
                return res.status(400).json(new ApiResponse(400, `Product ${dbProduct.name} is not visible`));
            }

            // Check position authorization
            if (dbProduct.positions && !dbProduct.positions.includes(req.user.role)) {
                return res.status(403).json(new ApiResponse(403, `You are not authorized to purchase: ${dbProduct.name}`));
            }

            const qty = Number(item.quantity) || 1;
            calculatedPrice += dbProduct.price * qty;

            validatedItems.push({
                product: dbProduct._id,
                quantity: qty,
                selectedPosition: item.selectedPosition,
                userInputValues: item.userInputValues
            });
        }

        const HANDLING_FEE = 0;
        const expectedTotal = calculatedPrice + HANDLING_FEE;

        // Verify total price (allowing a very small floating point tolerance)
        if (Math.abs(expectedTotal - totalPrice) > 0.01) {
            return res.status(400).json(new ApiResponse(400, `Price mismatch. Expected: ${expectedTotal}, Received: ${totalPrice}`));
        }

        const details = {
            name: `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim(),
            email: req.user.email,
            phone: "",
            rollNo: "",
            college: "",
            notes: notes || ""
        };

        const orderId = generateOrderId();
        const orderData = {
            orderId,
            items: validatedItems,
            totalPrice: expectedTotal,
            details,
            paymentScreenshot,
            status: "pending",
            userId: req.user.id
        };

        const order = await Order.create(orderData);
        return res.status(201).json(new ApiResponse(201, "Order placed successfully", { order }));
    } catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};

export const getOrdersMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiResponse(401, "Unauthorized"));
        }

        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, "Orders retrieved successfully", { orders }));
    } catch (error) {
        console.error("Get personal orders error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json(new ApiResponse(400, "Order ID is required"));
        }

        // Try searching by orderId first, then fallback to Mongoose ObjectId
        let order = await Order.findOne({ orderId: id }).populate('items.product').populate('userId');
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id).populate('items.product').populate('userId');
        }

        if (!order) {
            return res.status(404).json(new ApiResponse(404, "Order not found"));
        }

        const canAccess = (req.user && (["EB", "CORE"].includes(req.user.role) || String(order.userId) === String(req.user.id)));

        if (!canAccess) {
            return res.status(403).json(new ApiResponse(403, "Access denied"));
        }

        return res.status(200).json(new ApiResponse(200, "Order retrieved successfully", { order }));
    } catch (error) {
        console.error("Get order details error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};

export const listAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').populate('userId').sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, "All orders retrieved successfully", { orders }));
    } catch (error) {
        console.error("Admin retrieve orders error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'verified', 'ready', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json(new ApiResponse(400, "Invalid status provided"));
        }

        let order = await Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        }

        if (!order) {
            return res.status(404).json(new ApiResponse(404, "Order not found"));
        }

        order.status = status;
        await order.save();

        return res.status(200).json(new ApiResponse(200, "Order status updated successfully", { order }));
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json(new ApiResponse(400, "Order ID is required"));
        }

        let order = await Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        }

        if (!order) {
            return res.status(404).json(new ApiResponse(404, "Order not found"));
        }

        await Order.deleteOne({ _id: order._id });

        return res.status(200).json(new ApiResponse(200, "Order deleted successfully"));
    } catch (error) {
        console.error("Delete order error:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", { message: error.message }));
    }
};
