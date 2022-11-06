import { ReturnDocument } from 'mongodb';
import PostModel from '../models/Post.js'
import UserModel from '../models/User.js';

export const getLastTags = async (req, res) => {
     try {
        const data = await PostModel.find().limit(10).exec();
         const tags = data.map(obj =>  obj.tags)
       
        
         const unicTags = new Set(tags.flat())
      
        res.status(200).json( tags.flat())  
    } catch (error) {
        res.status(400).json({
            status: "error",
            message:"Is not resive"
            
       }) 
    }
}

export const create = async (req, res) => {
 
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.toLowerCase().split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })
       
        const post = await doc.save();
        
        res.json(post)
    } catch (error) {
        
        console.log((error))
        res.status(500).json({
            message:"Article is not created"
        })
    }

}


export const getAll = async (req, res) => {
 
    try {
       
        const data = await PostModel.find().populate('comment', {
            _id: true,
            comment:true
    }).populate('user').exec()
   
    
        res.status(200).json( data)  
    } catch (error) {
        res.status(400).json({
            status: "error",
            message:"Is not resive"
            
       }) 
    }
}

export const getpostById = async (req, res) => {
    try {
      
        const  id  = req.params.id
        PostModel.findOneAndUpdate(
            { _id: id },
            { $inc: { viewsCount: 1 } },
            { returnDocument: "after" },
            (err, doc) => {
               
          
            if (err) {
            return  res.status(500).json({
            status: "error",
            message:"Is not resive"
            })    
            }
            if (!doc) {
                return res.status(404).json({
                    message:"Article is not found"
                })
                }
                
             res.status(200).json(doc)
        }).populate('user')
      
    } catch (error) {
           res.status(400).json({
            status: "error",
            message:"Is not resive"
       })   
    }
}

export const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        PostModel.findByIdAndDelete({
            _id:id,
        }, (err, doc) => {
            if (err) {
           return  res.status(500).json({
            status: "error",
            message:"This article was not delete"
           })   
               
            }  if (!doc) {
                 return res.status(404).json({
                    message:"Article is not found"
                }) 
            } 
            res.status(200).json({
                success: true,
                
            })
        });
     
    } catch (error) {
        
    
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        await PostModel.updateOne({
            _id:id
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.toLowerCase().split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        
            
    
            
        })
       
        res.json({
            success:true
        })
    } catch (error) {
       
      res.status(400).json({
            status: "error",
            message:"Is not updated"
            
       })      
    }
}