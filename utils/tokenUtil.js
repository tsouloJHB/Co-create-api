const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken.model');

const RefreshTokenModel = require('../models/refreshToken.model');

//create token

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'2h',
    });
};

//create refresh token
const createRefreshToken = (id) =>{
    return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:'3d',
    });
}

const verifyRefreshToken = async(refreshToken) =>{
    try{
        const ver = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        if(!ver) throw new Error("bad");
        return ver;
    }catch(err){
       
        return err;
    }
}
const saveDeleteRefreshToken = async(id) =>{
   
    try{

        await RefreshTokenModel.deleteOne({
            _id:id
        });
       
        await RefreshTokenModel.create({
            owner:id
        });
    }catch(err){
        return err;
    }
}
//get id from token

//verify if user refresh token exits in database
const verifyRefreshTokenExitsInDatabase = async(id) =>{
    const user = await User.findById(id);
    const refresh = await RefreshToken.findOne({owner:user}); 
    if(!refresh){
        return true;
    }
    return false;
}

module.exports = {createToken,createRefreshToken,verifyRefreshToken,saveDeleteRefreshToken,verifyRefreshTokenExitsInDatabase};