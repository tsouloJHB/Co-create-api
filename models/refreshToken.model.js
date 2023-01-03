const mongoose = require('mongoose');
const {Schema , model} = mongoose;


const refreshTokenSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    }
});

const RefreshToken = model('refreshToken',refreshTokenSchema);
module.exports  =  RefreshToken;