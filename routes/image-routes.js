import express from 'express';
import authMiddleware from '../middleware/auth-middleware.js';
import isAdmin from '../middleware/admin-middleware.js';
import uploadMiddleware from '../middleware/upload-middleware.js';
import imageController from '../controllers/imageController.js';

const router = express.Router();

//upload an image
router.post('/upload', authMiddleware, isAdmin, uploadMiddleware.single('image'), imageController.uploadImage)

//get all the images
router.get('/get', authMiddleware, imageController.fetchImagesController);

router.delete('/delete/:id', authMiddleware, isAdmin ,imageController.deleteImage);

export default router; 