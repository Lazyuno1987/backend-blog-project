import mongoose from "mongoose";

    
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name']
    },
    email: {
        type: String,
        required: [true, 'Set email'],
        unique: true,
    },
    password: {
        type: String,
        required:true
    },
      userComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      require: true,
    },
    avatarUrl: String
    
}, { timestamps: true })

export default mongoose.model("User", UserSchema)