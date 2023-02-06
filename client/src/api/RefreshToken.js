

export const RefreshToken = async(logout,user,dispatch) =>{


   try {
	 const response = await fetch('http://localhost:8080/api/users',{
	        method:'GET',
	        headers: {'Authorization': `Bearer ${user.token}`},
	    })
	    //const json = await response.json();
	    if(!response.ok){
	        if(user){
	        
	            const refreshResponse = await fetch('http://localhost:8080/api/users/refresh-token',{
	            method:'POST',
	            headers:{'Content-Type':'application/json'},
	            body: JSON.stringify({refreshToken:user.refreshToken})
	            })
	            if(refreshResponse.ok){
	            
	                const json = await refreshResponse.json();
	                //create user object 
	                const newUser = {
	                  refreshToken: json.refreshTokenNew,
	                  token: json.token,
	                  user: user.user,
	                };
	                localStorage.setItem('user',JSON.stringify(newUser));
	                
	                //update the auth context
	                dispatch({type:'LOGIN',payload:newUser})
	             
	                
	                
	                console.log(newUser);
					return true
	            }else{
	            //if refresh token has expired log user out of the application
	            logout();
				return false
	            }
	        }
	    }
		return false 
        } catch (err) {
            if(!err.response){
				console.log(err);
                console.log("Network error connecting to the api");
            }       
			return false 
        }
   
}