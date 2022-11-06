import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
 
    comment: {
        type: String,
        required: [true, 'Set comment'],
       
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
       required:true,
    },
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      required:true,
    }
}, { timestamps: true })

export default mongoose.model("Comment", CommentSchema)