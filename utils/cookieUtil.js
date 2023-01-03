

const maxAge = 3 * 24 * 60 * 60;

const setCookies = (res,token,refreshToken) =>{
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge});
    res.cookie('refresh token',refreshToken,{httpOnly:true,maxAge:maxAge});

    return res;
}   

module.exports = setCookies;