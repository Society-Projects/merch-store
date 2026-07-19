import healthRoutes from '#src/functions/health.routes.js';
import authRoutes from "#src/functions/auth/auth.routes.js";
import productsRoutes from "#src/functions/products/products.routes.js";
import ordersRoutes from "#src/functions/orders/orders.routes.js";
import uploadRoutes from "#src/functions/upload/upload.routes.js";

import ApiResponse from '#src/classes/ApiResponse.js';

export default async function routes(app, prefix) {

    app.use(`${prefix}`, healthRoutes);
    app.use(`${prefix}/auth`, authRoutes);
    app.use(`${prefix}/products`, productsRoutes);
    app.use(`${prefix}/orders`, ordersRoutes);
    app.use(`${prefix}/upload`, uploadRoutes);

    // Only catch 404 for paths starting with the API prefix
    app.use(`${prefix}`, (req, res) => {
        return res.status(404).json(new ApiResponse(404, 'API endpoint not found'));
    });
}