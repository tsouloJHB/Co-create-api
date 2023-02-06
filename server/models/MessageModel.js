const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        groupChatId:{
            type:String,
        },
        privateChatId:{
            type:String,
        },
        senderId:{
            type:String,
        },  
        text:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Messages",MessageSchema);