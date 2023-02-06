
import { RefreshToken } from "./RefreshToken";


export const UserProject = async (user,dispatch,logout) =>{
    try {
        const response = await fetch('http://localhost:8080/api/project/',{
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
              UserProject(user,dispatch,logout,);
          }
        }
        return [];
    } catch (err) {
        
    }   
}