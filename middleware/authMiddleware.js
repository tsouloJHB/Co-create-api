const jwt = require('jsonwebtoken');
const createError = require('http-errors')


const protect = (req,res,next) =>{
    // let token;
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    //   ) {
    //     next();
    //   }
    if(!req.headers['authorization']) {
        return res.status(401).send("Access denied.");
    }
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        try {
          token = req.headers.authorization.split(' ')[1];
    
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
         
          next();
        } catch (error) {
            return res.status(401).send("Access denied.");
        }
      }
   

    
   
}
const role = (req,res,next) =>{
    next();
}

// module.exports.protect = async (req,res,next)=>{
//     next();
// }
module.exports = {protect, role};