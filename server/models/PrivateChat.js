const mongoose = require("mongoose");

const PrivateChatSchema = new mongoose.Schema(
    {
        members:{
            type:Array,
        },
    
    },
    {
        timestamps:true,    
    }
);

module.exports = mongoose.model("PrivateChat",PrivateChatSchema);