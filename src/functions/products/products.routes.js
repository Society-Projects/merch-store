import { Router } from "express";

import auth from "#src/middlewares/auth.js";

import { listProducts, getProductById, listAllProducts, createProduct, updateProduct, deleteProduct } from "#src/functions/products/products.controller.js";

const router = Router();

router.route('/')
    .get(listProducts);

router.route('/:id')
    .get(getProductById);

router.route('/all')
    .get(auth("EB"), listAllProducts);

router.route('/create')
    .post(auth("EB"), createProduct);

router.route('/:id')
    .put(auth("EB"), updateProduct)
    .delete(auth("EB"), deleteProduct);

export default router;