import User from '../models/User.js';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register controller
const registerUser = async (req, res) => {
    try {
        //deconstruct what we get from client
        const {username, email, password, role} = req.body;
        
        //check if user already exists
        const existingUser = await User.findOne({$or: [{username}, {email}]});//find duplicate username or email
        if (existingUser) {
            return res.status(400).json({
                success :  false,
                message : "User already exists"
            })
        }

        //hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creat a new user
        const newUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user'
        });
        await newUser.save();

        if (newUser){
            res.status(201).json({
                success : true,
                message : "User registration successful"
            });
        } else {
            res.status(400).json({
                success : false,
                message : "User registration unsuccessful"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Couldn't register, some error occured."
        })
    }
}

//login controller
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        //find if username exists
        const user = await User.findOne({username});

        if (!user){
            return res.status(400).json({
                success : false,
                message : "User doesn't exist, you need to register"
            });
        }

        //password vadation
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch){
            return res.status(401).json({
                success : false,
                message : "Username or Password is incorrect"
            });
        }

        //user token
        const accessToken = jwt.sign({
            userID : user._id,
            username : user.username,
            role : user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : "30m"
        });

        res.status(200).json({
            success : true,
            message : "Successful login",
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Couldn't register, some error occured."
        })
    }
};

const changePassword = async(req, res) => {
    try {
        const userID = req.userInfo.userID;

        //extract old and new password
        const {oldPassword, newPassword} = req.body;

        //find current logged in user
        const user = await User.findById(userID);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        //check if old password is the correct one
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch){
            return res.status(400).json({
                success: false,
                message: "Old password isn't correct"
            });
        }

        //hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        //update user password on db
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            sucess: true,
            message: "Password changed successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Couldn't register, some error occured."
        })
    }
}

export default {
    registerUser,
    loginUser,
    changePassword
}