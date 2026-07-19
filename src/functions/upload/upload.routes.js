import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiResponse from '#src/classes/ApiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.route('/')
    .post(async (req, res) => {
        try {
            const { base64, fileName } = req.body;
            if (!base64 || !fileName) {
                return res.status(400).json(new ApiResponse(400, 'Base64 data and fileName are required'));
            }

            // Remove metadata prefix (e.g. data:image/png;base64,) if present
            const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let base64Data = base64;
            if (matches && matches.length === 3) {
                base64Data = matches[2];
            }

            const buffer = Buffer.from(base64Data, 'base64');
            const fileExtension = path.extname(fileName) || '.png';
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExtension}`;

            const uploadDir = path.join(process.cwd(), 'public');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, uniqueFileName);
            await fs.promises.writeFile(filePath, buffer);

            const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
            const fileUrl = `${serverUrl}/public/${uniqueFileName}`;

            return res.status(200).json(new ApiResponse(200, 'File uploaded successfully', { url: fileUrl }));
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json(new ApiResponse(500, 'Failed to upload file', { message: error.message }));
        }
    });

export default router;
