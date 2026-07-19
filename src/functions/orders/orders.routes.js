import { Router } from "express";
import auth from "#src/middlewares/auth.js";
import { createOrder, getOrdersMe, getOrderById, listAllOrders, updateOrderStatus } from "./orders.controller.js";

const router = Router();

// Place a new order (can be guest or logged-in member)
router.route("/")
    .post((req, res, next) => {
        if (req.cookies?.session_token) {
            auth("MEMBER")(req, res, next);
        } else {
            next();
        }
    }, createOrder);

// Get currently logged-in user's orders
router.route("/me")
    .get(auth("MEMBER"), getOrdersMe);

// Get all orders (EB only)
router.route("/all")
    .get(auth("EB"), listAllOrders);

// Get single order detail (accessible by owner or EB/CORE admins)
router.route("/:id")
    .get((req, res, next) => {
        if (req.cookies?.session_token) {
            auth("MEMBER")(req, res, next);
        } else {
            next();
        }
    }, getOrderById);

// Update order status (EB only)
router.route("/:id/status")
    .put(auth("EB"), updateOrderStatus);

export default router;
