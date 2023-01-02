const { model } = require('mongoose');
const GroupChatModel = require('../models/GroupChatModel');
const PrivateChat = require('../models/PrivateChat');



module.exports.createGroupChat = async(projectId,userId) =>{
    const groupChat = new GroupChatModel({
        projectId,
        members:[userId]
    }); 
    try {
        const result = await groupChat.save();
        return true;           
    } catch (err) {
        return false;   
    }
}

module.exports.getUserGroupChats = async(req,res) =>{
    try {
        const chat = await GroupChatModel.find({
            members:{$in: [req.params.userId]},
        });
        
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);  
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
// module.exports.addUserToGroupChat = async(userId,groupChatId) =>{
  
//     try {
//         const groupChat = GroupChatModel.findByIdAndUpdate(
//             groupChatId,
//             {$push:{members:userId}}
//         );
//         res.status(200).json(groupChat);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

module.exports.getAllGroupChat = async(req,res) =>{

    try {
        const results = await GroupChatModel.find();
        console.log(results);
     
        res.status(200).json(results); 
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports.addUserToGroupChat = async(userId,projectId) => {

    try {
        const result = await GroupChatModel.findOneAndUpdate({projectId:projectId},{ $push: { members: userId }});
        return true;    
    
     } catch (err) {
        return false;
     }
}

