import jwt from 'jsonwebtoken';
import UserModel from "../models/User.js";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";


export const register = async (req, res) => {
   try {
   
  
    const passwordBody = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(passwordBody, salt)

       const doc = new UserModel({
        email: req.body.email,
        name: req.body.name,
        avatarUrl : req.body.avatarUrl,
        password: hashPassword,
        })
        
      
    const user = await doc.save();
       const token = jwt.sign({
       _id:user._id
       }, 'secret123', { expiresIn: '30d' })

       
       const {password, ...userData} = user._doc
    res.json({
        
        ...userData,
        token

        
    })
   } catch (error) {
       console.log(error)
       res.status(500).json({
           status: 'error',
           message:"Error registration"
    })
   }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password);
        if (!isValidPassword) {
            return res.status(404).json({
                message: "Invalid login or password"
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', { expiresIn: '30d' })
        const { password, ...userData } = user._doc
        res.json({
        
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: "Error authorization"
        })
    }
}

export const currentUser =async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message:"User not found"
            })
        }
       const { password, ...userData } = user._doc
        res.json({
        userData,
          
        })
    } catch (error) {
         console.log(error)
        res.status(500).json({
            status: 'error',
            message: "No access"
        })
    }
}