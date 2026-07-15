import '#src/config/env.js';

import express from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

import ApiResponse from '#src/classes/ApiResponse.js';
import routes from '#src/routes.js';

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    keyGenerator: (req) => ipKeyGenerator(req.ip),

    message: 'Too many requests from this IP, please try again later.'
}));

const prefix = process.env.API_PREFIX || '/api/v1';

routes(app, prefix);

export default app;