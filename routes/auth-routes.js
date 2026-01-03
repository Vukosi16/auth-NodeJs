import express from 'express';
import authController from '../controllers/auth-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';

const router = express.Router();

//all routes related to authntication and authirisation
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/changePassword', authMiddleware ,authController.changePassword);


export default router;