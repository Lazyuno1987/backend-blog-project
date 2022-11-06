import User from "../models/User.js";
import Comment from "../models/Comment.js"
import Post from "../models/Post.js";

export const createComment = async (req, res) => {

const userId = req.userId;
const { id } = req.params
  Comment.create({ ...req.body, user: userId, post:id }).then((comment) => {
    if (comment) {
      User.findByIdAndUpdate(userId, {
        $push: { userComment: comment._id },
      }).then((user) => {
          if (user) {
              Post.findByIdAndUpdate(id, {$push: { comment: comment._id }}).then((post) => {
                  if (post) {
                    
                     res.status(201).json({
            status: "success",
            code: 201,
            data: {
                comment,
                
            },
          });
                }
            })
         
        }
      });
    }
  });
};


export const getCommentsByPostId = async (req, res) => {
 try {
    
        const {id}=req.params
        const data = await Comment.find({ post: id }).populate('user');
    
        res.status(200).json( data)  
    } catch (error) {
        res.status(400).json({
            status: "error",
            message:"Is not resive"
            
       }) 
    }
}

export const getAllComments = async (req, res) => {
 
    try {
      
        const data = await Comment.find().populate('user').populate('post');
    
        res.status(200).json( data)  
    } catch (error) {
        res.status(400).json({
            status: "error",
            message:"Is not resive"
            
       }) 
    }
}