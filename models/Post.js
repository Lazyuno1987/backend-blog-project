import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Set title']
    },
    text: {
        type: String,
        required: [true, 'Set text'],
        unique: true,
    },
    tags: {
        type: Array,
        default:[]
        
    },
    viewsCount: {
        type: Number,
        default:0,
    }, 
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      required:true,
    },
    comment: {
      type: Array,
      ref: "Comment",
      require: true,
    },
    
    imageUrl: String
}, { timestamps: true })

export default mongoose.model("Post", PostSchema)