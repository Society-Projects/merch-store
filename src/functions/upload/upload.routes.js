import "#src/config/env.js";

import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import ApiResponse from '#src/classes/ApiResponse.js';

const router = Router();

// Configure cloudinary using variables in process.env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.route('/')
    .post(async (req, res) => {
        try {
            const { base64, fileName } = req.body;
            if (!base64) {
                return res.status(400).json(new ApiResponse(400, 'Base64 data is required'));
            }

            // Check if Cloudinary is configured
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                console.error("Cloudinary credentials are not configured in backend environment variables.");
                return res.status(500).json(new ApiResponse(500, 'Cloudinary credentials are not configured in backend environment variables.'));
            }

            // Upload directly to Cloudinary
            const result = await cloudinary.uploader.upload(base64, {
                folder: 'merch_store',
                public_id: fileName ? fileName.split('.')[0] + '-' + Date.now() : undefined,
                resource_type: 'auto'
            });

            return res.status(200).json(new ApiResponse(200, 'File uploaded successfully', { url: result.secure_url }));
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json(new ApiResponse(500, 'Failed to upload file to Cloudinary', { message: error.message }));
        }
    });

export default router;
