const MessageModel = require("../models/MessageModel");
const GroupChatModel = require("../models/GroupChatModel");
const Project = require("../models/project");


module.exports.addMessage = async(req,res) =>{
    const {projectId,senderId,text} = req.body;
    console.log(req.body);
 
    try {
       
        const groupChatModel = await GroupChatModel.findOne({projectId});
        
        if(groupChatModel){
            //console.log(groupChatModel)
            const message = new MessageModel({

                groupChatId:groupChatModel._id,           
                senderId,
                text
           
            });
            
      
            const result = await message.save();
            res.status(200).json(result);
        }else{
            res.status(401).json("project not found");
        }
       
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

module.exports.getGroupMessagesByProjectId = async (req,res) =>{
    const {projectId} = req.params;
    try {
        //from chatId from project
        const groupModel = await GroupChatModel.findOne({projectId});
        if(groupModel){
            const result = await MessageModel.find({groupChatId:groupModel._id});

            res.status(200).json(result);
        }else{
            res.status(500).json("project not found")
        }
      
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