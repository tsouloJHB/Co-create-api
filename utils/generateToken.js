const jwt = require('jsonwebtoken');


//create token

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'3d',
    });
};

//get id from token

module.exports = createToken;