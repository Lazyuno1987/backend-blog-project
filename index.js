import express from "express";
import mongoose from 'mongoose';
import multer from "multer";
import Jimp from 'jimp'
import cors from 'cors'
import { registerValidation, loginValidation, postValidation, commentValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, currentUser } from './controllers/userController.js';
import { createComment, getCommentsByPostId, getAllComments } from "./controllers/commentController.js";
import {create, getAll, getpostById, deleteById, updatePost, getLastTags} from './controllers/postController.js'
import validationErrors from "./utils/validationErrors.js";
import * as dotenv from "dotenv";
import path from 'path'
import fs from 'fs/promises'

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


 import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  
    const { path: tempUpload, originalname } = req.file;
    const imgDir = path.join(__dirname, "uploads");
   Jimp.read( `${imgDir}/${originalname}`, (err, image) => {
  if (err) throw err;
       image
      
     .resize(400, Jimp.AUTO)
  
    .quality(80) 
    .write(`${imgDir}/res${originalname}`); 
        
           res.json({ url: `uploads/res${originalname}`}) 
    });
  
 

})


app.get('/posts', getAll);
app.post('/posts', checkAuth,  create);
app.get('/tags', getLastTags)
app.get('/posts/:id',  getpostById);
app.delete('/posts/:id', checkAuth, deleteById);
app.patch("/posts/:id", checkAuth,  validationErrors, updatePost)
app.post("/posts/:id", checkAuth, commentValidation, createComment)
app.get("/comment/:id", commentValidation, getCommentsByPostId)
app.get('/comment', commentValidation, getAllComments)





app.listen(PORT, (error) => {
    if (error){
        return console.log(error)

    }
    console.log(`Server is running ${PORT}`)

})