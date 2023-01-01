const Post = require("../models/Post");
const User = require("../models/user");
const Project = require('../models/project');
const createError = require('http-errors');
const ProjectController = require('../controller/projectController');
const joinController = require('./joinController');


const minimumMembers = 2;

//@desc     Create post
//@route    POST api/posts/
//@access   Private
module.exports.create_post = async(req,res)=>{
    req.body.userId = req.id.id;
   
    try {
      const savedPost = await Post.create(req.body);
      //create project
      if(req.body.maxMembers >= minimumMembers){
        const newProject = new Project({
          projectName:req.body.projectName,
          postId:savedPost.id,
          userId:req.id.id,
          desc:req.body.desc,
          members:[req.id.id],
          maxMembers:req.body.maxMembers,
        });
        await newProject.save();
        res.status(200).json(savedPost);  
      }else{
        res.status(400).json("A project must have a minimum of 2 members"); 
      }
   
    } catch (err) {
      res.status(400).json(err);
    }
}


//@desc     Get post
//@route    POST api/posts/
//@access   Private
module.exports.get_post = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
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
    try {
      const newPosts = [];
      const posts = await Post.find();
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
      res.status(200).json(posts);
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

