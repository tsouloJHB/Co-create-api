import { useState } from "react";
import { useAuthContext } from "./useAuthContext";


export const useSignup = () => {
    const [error ,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    const signup = async (name,email,password) =>{
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('http://localhost:8080/api/users/signup',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({name,email,password})
        })
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false)
            console.log(json.errors);
            let error = "";

            if(json.errors.email !== ""){
                error  = json.errors.email
            }else if(json.errors.name !== ""){
                error = json.errors.name
            }
            if(json.errors.password !== ""){
                error = json.errors.password
            }
         
            setError(error);
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json));

            dispatch({type: 'LOGIN', payload:json});

            setIsLoading(false)
        }
    }

    return {signup , isLoading, error}
}