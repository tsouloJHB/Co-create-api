const jwt = require('jsonwebtoken');
const createError = require('http-errors')


const protect = (req,res,next) =>{
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
    
         
          next();
        } catch (error) {
            return res.status(401).send("Access denied.");
        }
      }
   
       //check for cookie as well
    
   
}
const role = (req,res,next) =>{
    next();
}

// module.exports.protect = async (req,res,next)=>{
//     next();
// }
module.exports = {protect, role};