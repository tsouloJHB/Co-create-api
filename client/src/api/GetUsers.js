
import { RefreshToken } from "./RefreshToken";

export const getUser = async(user,dispatch,logout) =>{
    try {
        const response = await fetch('http://localhost:8080/api/users/'+user,{
	        method:'GET',
	        headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
	    })
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
                user = JSON.parse(localStorage.getItem('user'))
                getUser(user,dispatch,logout,);
               
            }  
          }
          return [];
    } catch (err) {
        
    }
}

export const getUsers = async(user,users,dispatch,logout) =>{
    try {
        const response = await fetch(`http://localhost:8080/api/users/users/${users.join(',')}`,{
            method:'GET',
            headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
          
        })
        console.log(response)
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
                user = JSON.parse(localStorage.getItem('user'))
                getUser(user,dispatch,logout,);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
    

}   