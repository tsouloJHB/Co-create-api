import { RefreshToken } from "./RefreshToken";

export const getComments = async(postId,dispatch,logout) =>{
    const user = JSON.parse(localStorage.getItem('user'))
    try {
        const response = await fetch('http://localhost:8080/api/comments/'+postId,{
            method:'GET',
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
                getComments(postId,dispatch,logout);
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}

export const postComment = async(text,postId,dispatch,logout) =>{
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await fetch('http://localhost:8080/api/comments',{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            },
            body: JSON.stringify({postId,text})
          
        })
        console.log(response)
        if(response.ok){
            const json = await response.json();
            return json
          }
        
          if(response.status === 401){
              const refreshResponse = await RefreshToken(logout,user,dispatch);
            if(refreshResponse){
                postComment(text,postId,dispatch,logout);
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}

