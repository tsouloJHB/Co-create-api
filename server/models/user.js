const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:true,
        lowercase:true,
        Validate:[isEmail,"Please enter valid email"]     
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[6,"Minimum password length is 6 characters"]
    },
    name:{
        type:String,
        required:[true,"Please enter a name"],
        max:50
    },
    surname:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    country:{
        type:String,
        max:50
    },
    occupation:{
        type:String,
        max:50
    },
    cell:{
        type:String,
        max:11
    },
    countryCode:{
        type:String,
        max:11
    },
    skills:{
        type:String,
        max:100
    },
    desc: {
        type:String,
        max: 100,
    },
    image:{
        data:Buffer,
        contentType:String
    },
    online:{
        type:Boolean,
        default:false,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    
    
},
{ timestamps: true }  
);

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

//static login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user',userSchema);
module.exports = User;