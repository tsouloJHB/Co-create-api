
const { model } = require('mongoose');
const PrivateChat = require('../models/PrivateChat');




module.exports.createPrivateChat = async(req,res) =>{
    const newChat = new PrivateChat({
        members: [req.body.senderId, req.body.receiverId],
      });
      try {
        const result = await newChat.save();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
}

module.exports.getUserPrivateChats = async(req,res) =>{
    try {
        const chat = await PrivateChat.find({
            members:{$in: [req.params.userId]},
        });
        
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);  
    }
}


module.exports.getPrivateChat = async(req,res) =>{
    try {
        const privateChat = await PrivateChat.findOne({
            projectId:req.params.projectId
        });
        res.status(200).json(privateChat);
    } catch (err) {
        res.status(500).json(err);
    }
}