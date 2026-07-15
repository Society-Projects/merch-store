import { Router } from 'express';

import ApiResponse from '#src/classes/ApiResponse.js';

const router = Router()

router.get('/health', (req, res) => {
    return res.status(200).json(new ApiResponse(200, 'API is healthy'));
});

export default router;