import crypto from 'crypto';

import ApiResponse from '#src/classes/ApiResponse.js';
import UserObject from '#src/classes/UserObject.js';

import { User } from '#src/models/User.js';
import { Session } from '#src/models/Session.js';

export default async function authMiddleware(req, res, next) {
    try {
        const sessionToken = req.cookies?.session_token;
        if (!sessionToken) {
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', { message: 'No active session found' }));
        }

        const hash = crypto
            .createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await Session.findOne({ tokenHash: hash });
        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await Session.deleteOne({ _id: session._id });
            }
            res.clearCookie("session_token");
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', { message: 'Session expired or not found' }));
        }

        const user = await User.findById(session.userId);
        if (!user) {
            res.clearCookie("session_token");
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', { message: 'User not found' }));
        }

        req.user = new UserObject(user);
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}