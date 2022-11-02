import express from "express";
import mongoose from 'mongoose';
import multer from "multer";

import cors from 'cors'
import { registerValidation, loginValidation, postValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, currentUser } from './controllers/userController.js';
import {create, getAll, getpostById, deleteById, updatePost, getLastTags} from './controllers/postController.js'
import validationErrors from "./utils/validationErrors.js";
import * as dotenv from "dotenv";

dotenv.config();
const {DATA_BASE, PORT}=process.env

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

mongoose.connect(DATA_BASE)
    .then(() =>console.log("DB is ok"))
    .catch((err) =>console.log("DB is error", err))


app.use(express.json())
app.use(cors())
app.use('/uploads/', express.static("uploads"))

app.post("/auth/register",  registerValidation, validationErrors,  register)
app.post("/auth/login",  loginValidation, validationErrors, login);
app.get("/auth/current", checkAuth, currentUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
     res.json({
        url: `uploads/${req.file.originalname}`
    })
})


app.get('/posts', getAll);
app.post('/posts', checkAuth, postValidation, create);
app.get('/tags', getLastTags)
app.get('/posts/:id',  getpostById);
app.delete('/posts/:id', checkAuth, deleteById);
 app.patch("/posts/:id", checkAuth, postValidation, validationErrors, updatePost)




app.listen(PORT, (error) => {
    if (error){
        return console.log(error)

    }
    console.log(`Server is running ${PORT}`)
    
})