const jwt = require('jsonwebtoken');


//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id},'auth secret',{
        expiresIn:maxAge,
    });
}

module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
   
    try{
        if(email == "james@gmail.com" && password == "1234567"){
            
            const token = createToken("343242343");
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000});
            res.status(200).json({user:"123456"});
          }
        
    }catch (err){
        console.log(err)
       // res.status(400).json({"error":""});
    }
    
}