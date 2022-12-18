const jwt = require('jsonwebtoken');
const { refreshToken } = require('../controller/authController');


//create token

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'20s',
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
//get id from token

module.exports = {createToken,createRefreshToken,verifyRefreshToken};