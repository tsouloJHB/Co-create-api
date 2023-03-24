import React from "react";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import "./login.css"


const Login = () =>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {login,error,isLoading} = useLogin();
    const [errorEmail,setErrorEmail] = useState(null)
    const [errorPassword,setErrorPassword] = useState(null)
    const handleSubmit = async (e) =>{
        e.preventDefault();
        let error = false;
        if(email === null || email === ""){
          
          setErrorEmail("email field cannot be empty")
          error = true;
        }else{
          setErrorEmail(null)
        }
        if(password === null || password === ""){
          
          setErrorPassword("password field cannot be empty")
          error = true;
        }else{
          setErrorPassword(null)
        }
        if(error === false){
          await login(email,password)
        }
       
    }

    return (
      <div className="main-login">
      <p className="sign" align="center">Sign in</p>
     
      <form className="form-login" onSubmit={handleSubmit}>

  
      <div class="form-outline mb-4">
        <input type="email" id="loginName" onChange={(e) => setEmail(e.target.value)} value={email} class="form-control" />
        <label class="form-label" for="loginName">Email or username</label>
        { <p className="error-message">{errorEmail}</p> }
      </div>

    
      <div class="form-outline mb-4">
        <input type="password" id="loginPassword"  onChange={(e) => setPassword(e.target.value)} value={password}     class="form-control" />
        <label class="form-label" for="loginPassword">Password</label>
        { <p className="error-message">{errorPassword}</p> }
      </div>

    
      <div class="row mb-4">
        <div class="col-md-6 d-flex justify-content-center">
        
          <div class="form-check mb-3 mb-md-0">
            <input class="form-check-input"  type="checkbox" value="" id="loginCheck" checked />
            <label class="form-check-label" for="loginCheck"> Remember me </label>
          </div>
        </div> 

        <div class="col-md-6 d-flex justify-content-center">
       
          <a href="#!">Forgot password?</a>
        </div>
      </div>

  
      <button type="submit" class="btn btn-primary btn-block mb-4">Sign in</button>

   
      <div class="text-center">
        <p>Not a member? <Link to="/signup" >Sign up</Link></p>
        
      </div>
    </form>     
      </div>
  
      )
    
}

export default Login;