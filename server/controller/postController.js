const Post = require("../models/Post");
const User = require("../models/user");
const Project = require('../models/project');
const createError = require('http-errors');
const ProjectController = require('../controller/projectController');
const joinController = require('./joinController');
const groupController = require('../controller/GroupChatController');
const {upload} = require("../middleware/uploadMiddleware");
const fs = require('fs');


const minimumMembers = 2;

//@desc     Create post
//@route    POST api/posts/
//@access   Private
module.exports.create_post = async(req,res)=>{
    req.body.userId = req.id.id;
    // console.log(req.file.filename)
    // res.status(201).json("set");
     const tags = req.body.tags.split(",");
      req.body.tags = tags
  
    try {

    
     const savedPost = await Post.create(req.body);

    // const update = {
    //   $push: {
    //     tags: {
    //       $each: tags
    //     }
    //   }
    // };
    // const filter = { _id: savedPost._id };
    // Post.updateOne(filter, update, (err, result) => {
    //   if (err) {
    //     console.error('Error updating documents', err);
    //     return;
    //   }
    //   });
  
    //  console.log(req.body);

      //create project
      if(req.body.maxMembers >= minimumMembers){
        const newProject = new Project({
          projectName:req.body.projectName,
          postId:savedPost.id,
          userId:req.id.id,
          desc:req.body.desc,
          members:[req.id.id],
          maxMembers:req.body.maxMembers,
          tags:req.body.tags,
        });
        // const options = { ordered: true };
        // newProject.insertMany()
        groupResults = await newProject.save(); 

          // upload tags to project
        const update = {
        $push: {
          tags: {
            $each: tags
          }
        }
      };
      const filter = { _id: groupResults._id };
      // Project.updateOne(filter, update, (err, result) => {
      //   if (err) {
      //     console.error('Error updating documents', err);
      //     return;
      //   }
      //   }); 


        //upload image if provided for post and image
        if(req.file){
             //upload to post
             const newImagePost = await Post.findByIdAndUpdate(
              savedPost.id,{
              image:{
                  data:fs.readFileSync('uploads/'+req.file.filename),
                  contentType:'image/png'
              }});
              //upload to project

              const newImageProject = await Project.findByIdAndUpdate(
                groupResults.id,{
                image:{
                    data:fs.readFileSync('uploads/'+req.file.filename),
                    contentType:'image/png'
                }}); 
              if(!newImagePost && !newImageProject){
                res.status(401).json("Could not upload file");
              }
        }
        
        //create group chat
        groupController.createGroupChat(groupResults.id,req.id.id);
        res.status(201).json(savedPost);  
      }else{
        res.status(400).json("A project must have a minimum of 2 members"); 
      }
 
    } catch (err) {
      res.status(400).json(err);
      console.log(err)
    }
}


//@desc     Get post
//@route    POST api/posts/
//@access   Private
module.exports.get_post = async(req,res)=>{
  
    try {
        const post = await Post.findById(req.params.id)
        console.log(req.params.id);
        res.status(200).json(post);
      } catch (err) {
        res.status(400).json(err);
      }
}


//@desc     Get all post
//@route    POST api/posts/getallpost
//@access   public
module.exports.get_all_posts = async(req,res) =>{
  var mysort = { createdAt: -1 };
    try {
      const newPosts = [];
      const posts = await Post.find().sort(mysort);;
      // if project is in Inprogress
      const joinRemove = await Promise.all(
        posts.map(async (el) => {
            // console.log(el.id);
            // console.log(el.id);
            const project = await Project.findOne({postId:el.id});
            if(project){
              if(project.status == "NotStarted"){
                newPosts.push(el);
              }
              
            }
        })
      );
      res.status(200).json(newPosts);
    } catch (err) {
      console.log(err);
      res.status(400).json("No posts found")
    }
}

//@desc     Get all post for user
//@route    POST api/posts/getalluserpost
//@access   private
module.exports.get_user_posts = async(req,res) =>{
  try {
    const posts = await Post.find({userId: req.id.id});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json("No posts found")
  }
}

//@desc     Update post
//@route    POST api/posts/getalluserpost
//@access   public
module.exports.update_post = async(req,res) =>{
  try {
    const posts = await Post.findByIdAndUpdate(req.params.id,{
      $set:req.body,
  });
    res.status(201).json("Post has been updated");
  } catch (err) {
    console.log(err);
    res.status(500).json("No posts found")
  }
}

//@desc     Delete post
//@route    POST api/posts/deletepost
//@access   public
module.exports.delete_post = async(req,res) =>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      console.log(post);
      res.status(400).json("Post not found");  
    }else{
      //if project status is in InProgress to not delete anything
      const projectCheck = await Project.findOne({postId:req.params.id});
      if(projectCheck.status == "NotStarted"){
        const posts = await Post.findByIdAndDelete(req.params.id);
        //delete project
        ProjectController.delete_project_func(req.params.id);
        //delete all joins for post
        joinController.delete_all_joins(req.params.id);
        res.status(201).json("Post has been deleted");
      }
      res.status(400).json("Can't delete post with project in progress");
    }
    
   
  } catch (err) {
    console.log(err);
    res.status(500).json("post not found")
  }
}

