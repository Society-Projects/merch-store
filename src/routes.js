import healthRoutes from '#src/functions/health.routes.js';
import authRoutes from "#src/functions/auth/auth.routes.js";

import ApiResponse from '#src/classes/ApiResponse.js';

export default async function routes(app, prefix) {

    app.use(`${prefix}`, healthRoutes);
    app.use(`${prefix}/auth`, authRoutes);

    app.use(prefix, (req, res) => {
        return res.status(404).json(new ApiResponse(404, 'API endpoint not found'));
    });

    app.use((req, res, next) => {
        return res.status(404).json(new ApiResponse(404, 'API endpoint not allowed'));
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
    });
}