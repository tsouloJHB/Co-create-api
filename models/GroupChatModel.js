const mongoose = require("mongoose");

const GroupChatSchema = new mongoose.Schema(
    {
        members:{
            type:Array,
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("GroupChat",GroupChatSchema);