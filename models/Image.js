import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    },
    publicID : {
        type : String,
        required : true
    },
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
}, {timestamps : true});

export default mongoose.model('Image', ImageSchema);