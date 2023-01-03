const MessageModel = require("../models/MessageModel");


module.exports.addMessage = async(req,res) =>{
    const {privateChatId,groupChatId,senderId,text} = req.body;
        
    const message = new MessageModel({

        groupChatId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getGroupMessages = async (req,res) =>{
    const {groupChatId} = req.params;
    try {
        const result = await MessageModel.find({groupChatId});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getPrivateMessages = async (req,res) =>{
    const {privateChatId} = req.params;
    try {
        const result = await MessageModel.find({privateChatId});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getAllMessages = async(req,res) =>{
    try {
        const result = await MessageModel.find();
      
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);    
    }
}