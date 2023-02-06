const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
    {
        postId:{
            type: String,
            require:[true,"No post Id provided"],
            
        },
        userId:{
            type:String,
            require:[true,"No user Id provided"],
        },
        text:{
            type:String,
            require:[true,"No text provided"],
        },
      
    },
    { timestamps: true }
);

module.exports =  mongoose.model("Comments",CommentsSchema);
