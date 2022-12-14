const generateToken = require{'../utils/generateToken.js'};
const User = require("../modules/user");

module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
   
    try{
        const user = await User.login(email,password);
        const token = generateToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,'3d'});
        res.status(200).json({user:user._id});
    }catch (err){
        console.log(err)
        res.status(400).json({"error":""});
    }
  
    
}