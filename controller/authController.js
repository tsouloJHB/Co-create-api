const {createToken,createRefreshToken,verifyRefreshToken} = require('../utils/generateToken.js');
const User = require("../modules/user");
const RefreshTokenModel = require('../modules/refreshToken.model');
const bcrypt = require("bcrypt");
const { verify } = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const handleErrors = (err) =>{
    let errors = {"email":"","password":""};
     //incorrect email
     if(err.message === 'Incorrect email'){
        errors.email = 'Incorrect email';
    }

    //incorrect password
    if(err.message === 'Incorrect password'){
        errors.password = 'Incorrect password';
    }

    //duplicate error code
    if(err.code === 11000){
        errors.email = "That email is already registered";
        return errors;
    }
     //validation error
     if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//POST login
module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
   
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        const RefreshToken = createRefreshToken(user._id);

        //save refresh token to database
        const refreshTokenDoc = RefreshTokenModel({
            owner: user._id
        });
    
        await refreshTokenDoc.save();

        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge});
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

        res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({'user': user._id,'token':token,'refreshToken':RefreshToken});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }  

}


//@desc     Update User Profile
//@route    PUT api/users/users/:id
//@access   Private
module.exports.update_user = async (req,res)=>{
    // res.status(201).json({'user': '2334435'});
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash("1234567",salt);
            console.log(password);
            res.status(201).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }    
}


//Refresh token
module.exports.refreshToken = async(req,res,)=>{
    try{
        const {refreshToken} = req.body;
        if(!refreshToken) return res.status(400).json('Bad request');
        const userId  = await verifyRefreshToken(refreshToken);
        if(!userId.id) return res.status(400).json('Bad request');
        //create refresh token model
        const refreshTokenDoc = RefreshTokenModel({
            owner:userId.id
        });
        await refreshTokenDoc.save();
        await RefreshTokenModel.deleteOne({
            _id:userId.id
        });

        const token = await createToken(userId.id);
        console.log(userId.id);
        const refreshTokenNew = await createRefreshToken (userId.id);
        res.status(201).json({token,refreshToken});
       
    }catch(err){
        res.status(401).json("error");
    }    
}

//GET User
