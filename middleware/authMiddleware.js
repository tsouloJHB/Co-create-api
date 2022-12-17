const jwt = require('jsonwebtoken');


const protect = (req,res,next) =>{
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        next();
      }
      if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
      }  
   
}

// module.exports.protect = async (req,res,next)=>{
//     next();
// }
module.exports = {protect};