import { useContext,useState  } from "react";

import { AuthContext } from '../context/AuthContext';
import { useAuthContext } from "./useAuthContext";
export const useRefreshToken = () =>{
    const { user } = useContext(AuthContext);
    const [error ,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();


    const refreshtoken = async() =>{
        setIsLoading(true)
        setError(null)
        const refresh = user.refreshTokenNew
        console.log(refresh)
        console.log(user)
        const response = await fetch('http://localhost:8080/api/users/refresh-token',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({"refreshToken":refresh})
        })
        const json = await response.json();
        if(!response.ok){
            setIsLoading(false)
            console.log(response);
            console.log('error with refresh token');
            setError(error);
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json));

            dispatch({type: 'LOGIN', payload:json});

            setIsLoading(false)
        }

    }  
    return {refreshtoken,error}
}