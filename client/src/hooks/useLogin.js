import {useState} from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () =>{
    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext()

    const login = async (email ,password) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(' http://localhost:8080/api/users/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({email,password})
        })

        const json = await response.json()
        console.log(json);
        if(!response.ok){
            setIsLoading(false)
            let error = "";

            if(json.errors.email !== ""){
                error  = json.errors.email
            }
            if(json.errors.password !== ""){
                error = json.errors.password
            }
            setError(error);
        }
        if(response.ok){
            // save the user to local storage
            localStorage.setItem('user',JSON.stringify(json));

            //update the auth context
            dispatch({type:'LOGIN',payload:json})

            //update is loading state
            setIsLoading(false);
        }
    }

    return {login, isLoading, error}
}