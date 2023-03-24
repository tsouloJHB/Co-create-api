
import { RefreshToken } from "./RefreshToken";
import {useNavigate} from 'react-router-dom';
var timeOut = 0;

const navigate = useNavigate();
export const getUser = async(user,dispatch,logout) =>{
   
    try {
        const response = await fetch('http://localhost:8080/api/users/'+user,{
	        method:'GET',
	        headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
	    })

        if(response.ok){
            const json = await response.json();
            timeOut = 0
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
                user = JSON.parse(localStorage.getItem('user'))
                getUser(user,dispatch,logout);
                timeOut = timeOut + 1
            }  
          }
          return [];
    } catch (err) {
        
    }
}

export const getUsers = async(users,dispatch,logout) =>{
    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch(`http://localhost:8080/api/users/users/${users.join(',')}`,{
            method:'GET',
            headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
          
        })
 
        if(response.ok){
            const json = await response.json();
            console.log(json)
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
               
                getUsers(user,dispatch,logout);
               
            }else{
                navigate("/login") 
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
    

}   



export const updateUserProfile = async(dataObj,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/users/',{
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: JSON.stringify(dataObj)
          
        })
        console.log(response)
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
              
                updateUserProfile(dataObj,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}


export const updateUserProfilePicture = async(image,dispatch,logout) =>{
    console.log(image)
    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/users/upload',{
            method:'PUT',
            headers: { 
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            },
            body: image
            
          
        })
        
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
              
                updateUserProfilePicture(image,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}