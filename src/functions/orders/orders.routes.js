import { Router } from "express";
import auth from "#src/middlewares/auth.js";
import { createOrder, getOrdersMe, getOrderById, listAllOrders, updateOrderStatus, deleteOrder } from "#src/functions/orders/orders.controller.js";

const router = Router();

// Place a new order (must be logged-in user either MEMBER or CORE or EB role)
router.route("/")
    .post(auth(), createOrder);

// Get currently logged-in user's orders
router.route("/me")
    .get(auth(), getOrdersMe);

// Get all orders (EB only)
router.route("/all")
    .get(auth("CORE"), listAllOrders);

// Get single order detail (accessible by owner or EB/CORE admins)
router.route("/:id")
    .get(auth(), getOrderById)
    .delete(auth("CORE"), deleteOrder);

// Update order status (EB/CORE only)
router.route("/:id/status")
    .put(auth("CORE"), updateOrderStatus);

export default router;
