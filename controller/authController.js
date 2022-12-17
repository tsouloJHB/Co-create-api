const generateToken = require('../utils/generateToken.js');
const User = require("../modules/user");

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
        const token = generateToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge});
        res.status(200).json({user:user._id,'token':token});
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
        const token = generateToken(user._id);
        res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({'user': user._id,'token':token});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }  

}


//@desc     Update User Profile
//@route    PUT api/users/users/:id
//@access   Private
module.exports.update_user = async (req,res)=>{
    res.status(201).json({'user': '2334435'});    
}

//GET User