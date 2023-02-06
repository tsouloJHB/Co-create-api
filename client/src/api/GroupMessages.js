import { RefreshToken } from "./RefreshToken";

export const getGroupMessages = async(groupId,user,dispatch,logout) =>{
    try {
        const response = await fetch('http://localhost:8080/api/message/groupChat/projectId/'+groupId,{
            method:'GET',
            // headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
          
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
                getGroupMessages(user,dispatch,logout,);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}

export const sendMessage = async(message,projectId,user,dispatch,logout) =>{
    const text = message;
    const senderId = user.user
    try {
        const response = await fetch('http://localhost:8080/api/message',{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
                'My-Custom-Header': 'foobar'
            },
            body: JSON.stringify({text,senderId,projectId})
          
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
                sendMessage(message,projectId,user,dispatch,logout);
               
            }  
          }
          return [];
    } catch (err) {
        console.log(err)
    }
}

