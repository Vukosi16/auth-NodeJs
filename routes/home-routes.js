import express from 'express';
import authMiddleware from '../middleware/auth-middleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware , (req, res) => {
    const {username, userId, role} = req.userInfo;
    res.json({
        message : "Welcome to the homepage",
        user : {
            _id: userId,
            username: username,
            role: role
        }
    });
})

export default router;