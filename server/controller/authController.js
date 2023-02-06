const {createToken,createRefreshToken,verifyRefreshToken,saveDeleteRefreshToken} = require('../utils/tokenUtil');
const User = require("../models/user");
const setCookies = require('../utils/cookieUtil');
const handleErrors = require('../utils/errors.js');
const RefreshToken = require('../models/refreshToken.model');
const mongoose = require('mongoose');



//@desc     POST User Profile
//@route    POST api/users/users/
//@access   Public
module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
   
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        const RefreshToken = createRefreshToken(user._id);
        //save refresh token to database
        await saveDeleteRefreshToken(user.id);
        res = setCookies(res,token,RefreshToken);
        res.status(200).json({user:user._id,'token':token,'refreshToken':RefreshToken});
    }catch (err){
        const errors = handleErrors(err);
        console.log(err);
        res.status(401).json({errors});
    }
}


//@desc     Update User Profile
//@route    POST api/users/users/
//@access   Public
module.exports.sign_up = async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const user = await User.create({email,password,name});
        const token = await createToken(user._id);
        const RefreshToken = await createRefreshToken(user._id);
        saveDeleteRefreshToken(user._id);
        res = setCookies(res,token,RefreshToken);
        res.status(201).json({'user': user._id,'accessToken':token,'refreshToken':RefreshToken});
    }catch(err){
        const errors = handleErrors(err);
        console.log(err);
        res.status(400).json({errors});
    }  

}


//@desc     Update User Profile
//@route    PUT api/users/users/:id
//@access   Private
module.exports.update_user = async (req,res)=>{
 
  
        try{
            const user = await User.findByIdAndUpdate(req.id.id,{
                $set:req.body,
            });
            res.status(201).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
     
}


//@desc     Refresh token
//@route    POST api/users/users/
//@access   Public
module.exports.refreshToken = async(req,res,)=>{
    try{
        const {refreshToken} = req.body;
        if(!refreshToken) return res.status(400).json('Bad request');
        const userId  = await verifyRefreshToken(refreshToken);
        if(!userId.id) return res.status(400).json('Bad request');
        //create refresh token model
        saveDeleteRefreshToken(userId.id);
        
        const token = await createToken(userId.id);
        const refreshTokenNew = await createRefreshToken(userId.id);

        res = setCookies(res,token,refreshTokenNew);
        res.status(201).json({token,refreshTokenNew});
       
    }catch(err){
        res.status(401).json("error");
    }    
}


//@desc     GET user Profile
//@route    GET api/users/users/:id
//@access   Private
module.exports.get_user = async(req,res) =>{
  
    if(req.id.id){
        const user = await User.findById(req.id.id);
        const { password, isAdmin,createdAt,updatedAt,__v, ...other } = user._doc;
        // const user = User.findById(req.id.id);
        res.status(200).json(other);
    }else{
        res.status(403).json("Unknown user");
    }
}

//@desc     GET users
//@route    GET api/users/users
//@access   Private
module.exports.get_users = async(req,res) =>{
    const users =  req.params.users.split(',');
    
    try {
        const user_info = [];
        
	    if(req.id.id){
	 

        const request = await Promise.all(
            users.map(async (user) => {
                var foundUser = await User.findById(user);  
              return foundUser;
            })
          );

            // await users.find().forEach(function(user) {
            //     user_info.push(user);
            // });
         
	        res.status(200).json(request);
	    }else{
	        res.status(403).json("Unknown user");
	    }
    } catch (err) {
        console.log(err)
        res.status(501).json(err);
    }
}

//@desc     GET user Profile
//@route    GET api/users/users/:id
//@access   Private
module.exports.get_user_by_id = async(req,res) =>{
    const userId = req.params.userid;
    if(req.id.id && userId){
        const user = await User.findById(userId);
        const { password, isAdmin,createdAt,updatedAt,__v, ...other } = user._doc;
        // const user = User.findById(req.id.id);
        res.status(200).json(other);
    }else{
        res.status(403).json("Unknown user");
    }
}

//@desc     Log user out
//@route    GET api/users/users/
//@access   Private
module.exports.logout = async(req,res) =>{
    const user = await User.findById(req.id.id);
 
  try {
     res.cookie('jwt', '',{maxAge:1});
      await RefreshToken.deleteMany({owner:user});
      //destroy token ?
      res.status(200).json('User logged out');
  } catch (error) {
    res.status(401).json('User not found');
  }
   
   
}

//@desc     Change password
//@route    GET api/users/users/
//@access   Public
module.exports.change_password = async(req,res) =>{
  const user = await User.find({email:req.body.email}); 
  if(!user){
    res.status(401).json('Email not found');
  }
  try {
      const user1 = await User.findOneAndUpdate({email:req.body.email},{$set:req.body.password});
      console.log(user1);
      res.status(201).json('Password updated');
  } catch (error) {
    const errors = handleErrors(error);
    console.log(error);
    res.status(401).json({errors});
  }
   
   
}
