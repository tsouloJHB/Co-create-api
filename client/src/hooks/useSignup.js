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
           
            if(json.errors.email !==  ''){
                console.log("email")
                error  = json.errors.email
                setError(error);
                return error
            }
            if(json.errors.name !== undefined){
               console.log("name")
                error = json.errors.name
                setError(error);
                return error
            }
            if(json.errors.surname !==  undefined){
                console.log("surname")
                error = json.errors.surname
                setError(error);
                return error
            }
            if(json.errors.password !==  undefined){
                console.log("password")
                error = json.errors.password
                setError(error);
                return error
            }
            console.log(error)
           
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