
import { RefreshToken } from "./RefreshToken";

export const createProjectPost = async(projectName,desc,maxMembers,user,dispatch,logout) =>{
   
    try {
        const response = await fetch('http://localhost:8080/api/posts',{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: JSON.stringify({projectName,desc,maxMembers})
          
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
                createProjectPost(projectName,desc,maxMembers,user,dispatch,logout);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}


export const getProjectByPostId = async(postId,user,dispatch,logout) =>{
    try {
       const response = await fetch('http://localhost:8080/api/project/'+postId,{
           method:'GET',
           headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
              
           }
       
         
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
               getProjectByPostId(postId,user,dispatch,logout);
              
           }  
         }
         return [];
   } catch (err) {
       console.log(err)
   }
}


export const updateProject = async(dataObj,postId,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/project/'+postId,{
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
              
                updateProject(dataObj,postId,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}


export const removeUser = async(userId,projectId,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/project/removeuser/'+projectId,{
            method:'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: JSON.stringify({userId})
          
        })
        console.log(response)
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
         
                removeUser(userId,projectId,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}