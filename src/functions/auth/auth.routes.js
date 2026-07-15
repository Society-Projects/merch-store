import { Router } from 'express';
import crypto from 'crypto';

import authenticate from '#src/middlewares/auth.js';
import ApiResponse from '#src/classes/ApiResponse.js';
import UserObject from '#src/classes/UserObject.js';
import { User } from '#src/models/User.js';
import { Session } from '#src/models/Session.js';
import generateDeviceInfo from '#src/utils/deviceInfo.js';
import { cookieOptions } from '#src/utils/options.js';

const router = Router();

router.route('/')
    .get((req, res) => {
        try {
            const URL = ['https://accounts.google.com/o/oauth2/v2/auth?',
                `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
                `&redirect_uri=${process.env.FRONTEND_URL}/auth/callback`,
                `&response_type=code`,
                `&access_type=offline`,
                `&prompt=consent`,
                `&scope=${['email', 'profile'].join('%20')}`,
                `&flowName=GeneralOAuthFlow`,
                `&hd=thapar.edu`
            ].join('')

            return res.status(200).json(new ApiResponse(200, 'Google OAuth URL generated successfully', { url: URL }));
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
        }
    })

router.route('/callback')
    .get(async (req, res) => {
        try {
            if (!req.query) {
                return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'Missing query parameters' }));
            }

            const { code, scope } = req.query;
            if (!code || !scope) {
                return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'Missing required query parameters' }));
            }

            const scopes = scope.split(' ');
            if (!scopes.includes('email') || !scopes.includes('profile')) {
                return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'Invalid scope' }));
            }

            const accessTokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    code: code,
                    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                    redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
                    grant_type: 'authorization_code'
                })
            });

            const accessTokenData = await accessTokenResponse.json();
            if (!accessTokenData.access_token) {
                return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'Failed to obtain access token' }));
            }

            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                    'Content-Type': 'application/json'

                }
            });

            const userInfo = await userInfoResponse.json();
            if (!userInfo) return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'Failed to obtain user info' }));

            let user = await User.findOne({ googleAccountIdentifier: userInfo.id });
            if (!user) {
                user = new User({
                    firstName: userInfo.given_name,
                    lastName: userInfo.family_name,
                    email: userInfo.email,
                    avatar: userInfo.picture,
                    googleAccountIdentifier: userInfo.id
                });
            }
            else {
                user.firstName = userInfo.given_name;
                user.lastName = userInfo.family_name;
                user.email = userInfo.email;
                user.avatar = userInfo.picture;
            }
            await user.save();

            const sessionToken = crypto.randomBytes(32).toString("hex");
            const hash = crypto.createHash("sha256").update(sessionToken).digest("hex");

            const deviceInfo = generateDeviceInfo(req.headers['user-agent'] || 'Unknown');
            const existingSession = await Session.findOne({ userId: user._id, deviceInfo: deviceInfo, ipAddress: req.ip });

            if (existingSession) {
                await Session.deleteOne({ _id: existingSession._id });
            }

            await Session.create({
                userId: user._id,

                hash: hash,
                expiresAt: new Date(Date.now() + cookieOptions.maxAge),

                ipAddress: req.ip,
                userAgent: req.headers['user-agent'] || 'Unknown',
                deviceInfo: deviceInfo
            })

            res.cookie('session_token', sessionToken, cookieOptions);

            return res.status(200).json(new ApiResponse(200, 'User authenticated successfully', { user: new UserObject(user) }));
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
        }
    })

router.route('/me')
    .get(authenticate, async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json(new ApiResponse(404, 'Not Found', { message: 'User not found' }));
            }

            return res.status(200).json(new ApiResponse(200, 'User retrieved successfully', { user: new UserObject(user) }));
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
        }
    });


router.route('/logout')
    .delete(authenticate, async (req, res) => {
        try {
            const sessionToken = req.cookies?.session_token;
            if (!sessionToken) {
                return res.status(400).json(new ApiResponse(400, 'Bad Request', { message: 'No active session found' }));
            }

            const hash = crypto.createHash("sha256").update(sessionToken).digest("hex");
            await Session.deleteOne({ hash: hash });

            res.clearCookie('session_token');
            return res.status(200).json(new ApiResponse(200, 'User logged out successfully', { message: 'You have been logged out.' }));
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
        }
    });


export default router;