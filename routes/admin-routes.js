import express from 'express';
import authMiddleware from '../middleware/auth-middleware.js';
import isAdmin from '../middleware/admin-middleware.js';

const router = express.Router();

router.get('/admin-dashboard', authMiddleware, isAdmin,  (req, res) => {
    res.json({
        message : "Welcome to admin page"
    })
})

export default router;