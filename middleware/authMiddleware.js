const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken.model');
const { verifyRefreshTokenExitsInDatabase } = require('../utils/tokenUtil');
const { Error } = require('mongoose');
const protect = async(req,res,next) =>{
   //check for cookie as well
    if(!req.headers['authorization'] ) {
        return res.status(401).send("Access denied.");
    }
    // check for cookie

  
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
       
      ) {
        try {
          token = req.headers.authorization.split(' ')[1];

          //get value from cookie

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.id = decoded;
    
          req.user = await User.findById(decoded.id.id).select('-password');
          //check if refresh token is active in the database
         if (await verifyRefreshTokenExitsInDatabase(req.id.id)) {
          return res.status(401).send("Access denied.");
         }
          // const user = await User.findById(req.id.id);
          // const refresh = await RefreshToken.findOne({owner:user}); 
          // if(!refresh){
          //   return res.status(401).send("Access denied. middle");
          // }
          next();
        } catch (error) {
          console.log(error);
            return res.status(401).send("Access denied.");
        }
      }
   
       //check for cookie as well
    
   
}
const role = (req,res,next) =>{
    next();
}
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};



// module.exports.protect = async (req,res,next)=>{
//     next();
// }
module.exports = {protect, role};