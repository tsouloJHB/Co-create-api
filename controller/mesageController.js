const MessageModel = require("../models/MessageModel");
const messageModel = require("../models/MessageModel");

module.exports.addMessage = async(req,res) =>{
    const {chatId,senderId,text} = req.body;
    const message = new MessageModel({
        chatId,
        senderId,
        text,
    });
    try {
        
    } catch (err) {
        
    }
}