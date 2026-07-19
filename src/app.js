import '#src/config/env.js';

import express from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

import ApiResponse from '#src/classes/ApiResponse.js';
import routes from '#src/routes.js';

app.set('trust proxy', 1);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    keyGenerator: (req) => ipKeyGenerator(req.ip),

    message: 'Too many requests from this IP, please try again later.'
}));

// // Serve local public uploads
// app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Serve frontend static build files
app.use(express.static(path.join(process.cwd(), 'client/dist')));

const prefix = process.env.API_PREFIX || '/api/v1';

routes(app, prefix);

// Wildcard route to serve the React SPA index.html
// app.get((req, res, next) => {
//     if (req.path.startsWith(prefix)) {
//         return next();
//     }
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// Express global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
});

export default app;