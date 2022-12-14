const jwt = require('jsonwebtoken');


//create token

const createToken = (id)=>{
    return jwt.sign({id},'auth secret',{
        expiresIn:'3d',
    });
};

module.exports = createToken;