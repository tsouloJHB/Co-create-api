
import { RefreshToken } from "./RefreshToken";

export const fetchPosts = async(user,dispatch,logout) =>{

    const response = await fetch(' http://localhost:8080/api/posts/all',{
        method:'GET',
        headers:{'Content-Type': 'application/json'}
    })
    const json = await response.json();
    if(response.ok){
  
      
      const lJoins =  await fetchAllJoinRequest(user,dispatch,logout)
      console.log(lJoins);
      if(lJoins){
        
        let data = [];
        json && json.forEach(post => {
        let returnObject = post
        if(lJoins){
          lJoins.some((join) => join.postId !== post._id ? "": returnObject = "" ) 
        }
        if(returnObject !== "") {
          data.push(post);
          return returnObject
        }else{
          return returnObject
        }
      });
    
      if(data){
       
        return data;
       
      }
      }
    }

    
}

export const fetchAllJoinRequest = async (user,dispatch,logout) =>{
  
    const response = await fetch('http://localhost:8080/api/join/requests',{
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
        fetchAllJoinRequest(user,dispatch,logout,);
       
    }  
  }
  return [];

}
