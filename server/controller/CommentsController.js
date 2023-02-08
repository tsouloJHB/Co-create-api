
const CommentsModel = require('../models/CommentsModel');
const Comments = require('../models/CommentsModel');
const User = require('../models/user');
const Post = require("../models/Post");

module.exports.post_comment = async(req,res)=>{
    const {text,postId} = req.body;
    const userId = req.id.id;
    try {
        //check if post exists
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json("Post not found");
        if(text !== null && text.length > 3 ){
            const comment  = new Comments({
                postId,
                userId,
                text,
            });
            const savedComment = await comment.save();
            res.status(201).json(savedComment)
        }else{
            res.status(400).json("The text must at least be 3 character");
        }
    } catch (err) {
        res.status(500).json(err)   
    }

}

module.exports.get_comments = async(req,res) =>{
    const postId = req.params.postId
    try {
        if(postId){
            const comments = await CommentsModel.find({postId});
            //get user profile from comments
         
            
            const request = await Promise.all(
                comments.map(async (comment) => {
                    var commentsAndUsers = {
                        user:"",
                        comment:""
                    };
                    var foundUser = await User.findById(comment.userId);
                    const { password, isAdmin,createdAt,updatedAt,__v, ...other } = foundUser._doc;
                    commentsAndUsers.user = other;
                    commentsAndUsers.comment = comment;
                  return commentsAndUsers;
                })
              );
              
            if(request.length > 0){
                res.status(200).json(request);
            }else{
                res.status(200).json({});
            }
        }else{
            res.status(400).json("No postId provided");
        }
    } catch (err) {
        res.status(500).json(err)  
    }
}