

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

module.exports = handleErrors;