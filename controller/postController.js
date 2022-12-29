const Post = require("../models/Post");
const User = require("../models/user");
const createError = require('http-errors');



//@desc     Create post
//@route    POST api/posts/
//@access   Private
module.exports.create_post = async(req,res)=>{
    const newPost = new Post(req.body);
    try {
      const savedPost = await Post.create(req.body);
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
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
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
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
      createError(500);
      res.status(400).json("Post not found");  
    }else{
      const posts = await Post.findByIdAndDelete(req.params.id);
      res.status(201).json("Post has been deleted");
    }
    
   
  } catch (err) {
    console.log(err);
    res.status(500).json("post not found")
  }
}

