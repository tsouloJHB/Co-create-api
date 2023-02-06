import { RefreshToken } from "./RefreshToken";

export const getJoinRequest = async(postId,user,dispatch,logout) =>{
    try {
        const response = await fetch('http://localhost:8080/api/join/'+postId,{
            method:'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
          
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
                getJoinRequest(postId,user,dispatch,logout);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}


export const fetchAllJoinRequest = async (user,dispatch,logout) =>{

   try {
	 const response = await fetch('http://localhost:8080/api/join/'+user.user,{
        method:'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
           
        },
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
                fetchAllJoinRequest(user,dispatch,logout);
            
            }  
        }
        return [];
    } catch (err) {
        console.log(err)
    }


}

export const cancelJoinRequest = async(postId,user,dispatch,logout) =>{
    try {
        const response = await fetch('http://localhost:8080/api/join/'+postId,{
            method:'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
          
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
                await cancelJoinRequest(postId,user,dispatch,logout);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}