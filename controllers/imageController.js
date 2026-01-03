import Image from '../models/Image.js';
import uploadToCloudinary from '../helpers/cloudinaryHelper.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const uploadImage = async(req, res) => {
    try {
        //check if file was sent from frontend in req obj
        if (!req.file){
            return res.status(400).json({
                success: false,
                message: "File needs to be sent. Please upload image"
            })
        }

        //upload to cloudinary (if not empty)
        const {url, publicID} = await uploadToCloudinary(req.file.path);        

        //store image url and public ID in MongoDB
        const uploadedImage = new Image ({
            imageUrl: url, 
            publicID,
            uploadedBy : req.userInfo.userID
        })
        await uploadedImage.save()

        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: uploadedImage
        })

    } catch (error) {
        console.error();
        res.status(500).json({
            success : false,
            message : "Something went wrong please try again."
        })
    }
}

const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit; 

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const totalImages = await Image.countDocuments();

        const totalPages =  Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }
    } catch (error) {
        console.log(error);
         res.status(500).json({
            success : false,
            message : "Something went wrong please try again."
        });
    }
}

const deleteImage = async (req, res) => {
    try {

        const getImageID = req.params.id;        
        const userID = req.userInfo.userID;

        const image = await Image.findById(getImageID);        

        if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        //check if the image was uploaded by the user trying to delete it
        if(image.uploadedBy.toString() !== userID){
             return res.status(403).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        //delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicID);

        //delete on DB
        await Image.findByIdAndDelete(getImageID);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })
    } catch (error) {
        console.log(error);
         res.status(500).json({
            success : false,
            message : "Couldn't delete image"
        });
    }
}

export default {uploadImage,
    fetchImagesController,
    deleteImage
};