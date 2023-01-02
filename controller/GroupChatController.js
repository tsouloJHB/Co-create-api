const { model } = require('mongoose');
const GroupChatModel = require('../models/GroupChatModel');



module.exports.getUserChats = async(req,res) =>{
    try {
        const chat = await GroupChatModel.find({
            members:{$in: [req.params.userId]},
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);  
    }
}

module.exports.getGroupChat = async(req,res) =>{
    try {
        const groupChat = await GroupChatModel.findOne({
            projectId:req.params.projectId
        });
        res.status(200).json(groupChat);
    } catch (err) {
        res.status(500).json(err);
    }
}


