
import { RefreshToken } from "./RefreshToken";

export const createProjectPost = async(formData,user,dispatch,logout) =>{
    
    try {
        const response = await fetch('http://localhost:8080/api/posts',{
            method:'POST',
            headers: { 
                
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: formData
          
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
                createProjectPost(formData,user,dispatch,logout);
               
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

export const deleteProject = async(projectId,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/project/'+projectId,{
            method:'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
        
          
        })
   
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
         
                deleteProject(projectId,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}



export const getProjectJoinRequest = async(postId,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
       const response = await fetch('http://localhost:8080/api/join/'+postId,{
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
          
               getProjectByPostId(postId,user,dispatch,logout);
              
           }  
         }
         return [];
   } catch (err) {
       console.log(err)
   }
}


export const acceptUser = async(postId,joinId,status,dispatch,logout) =>{

    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/join/',{
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: JSON.stringify({postId,joinId,status})
          
        })
        console.log(response)
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
              
                acceptUser(postId,joinId,status,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}

export const exitProject = async(projectId,dispatch,logout) =>{
    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/project/exitproject/'+projectId,{
            method:'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
        
          
        })
   
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
         
                exitProject (projectId,dispatch,logout)
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}