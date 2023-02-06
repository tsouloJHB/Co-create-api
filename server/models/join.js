const mongoose = require("mongoose");

const JoinSchema = new mongoose.Schema(
    {
        postId:{
            type: String,
            require:[true,"No post Id provided"],
            
        },
        userId:{
            type:String,
            require:[true,"No user Id provided"],
        },
        status:{
            type:String,
            enum: ["Accepted", "Rejected", "Pending"],
            default: "Pending",
        }
    },
    { timestamps: true }
);

module.exports =  mongoose.model("Join",JoinSchema);