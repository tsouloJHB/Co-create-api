import { useState } from "react";
import { useAuthContext } from "./useAuthContext";


export const useSignup = () => {
    let [error ,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    const signup = async (name,surname,email,password) =>{
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('http://localhost:8080/api/users/signup',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({name,surname,email,password})
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
            if(json.errors.surname !== ""){
                error = json.errors.surname
            }
            if(json.errors.password !== ""){
                error = json.errors.password
            }
         
            setError(error);
        }
        if(response.ok){
            console.log(JSON.stringify(json))
            // localStorage.setItem('user',JSON.stringify(json));

            // dispatch({type: 'LOGIN', payload:json});

            setIsLoading(false)
        }
    }

    return {signup , isLoading, error}
}