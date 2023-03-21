import React from "react";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import "./login.css"


const Login = () =>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {login,error,isLoading} = useLogin();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        await login(email,password)
    }

    return (
      <div className="main-login">
      <p className="sign" align="center">Sign in</p>
     
      <form className="form-login" onSubmit={handleSubmit}>

  
      <div class="form-outline mb-4">
        <input type="email" id="loginName" onChange={(e) => setEmail(e.target.value)} value={email} class="form-control" />
        <label class="form-label" for="loginName">Email or username</label>
      </div>

    
      <div class="form-outline mb-4">
        <input type="password" id="loginPassword"  onChange={(e) => setPassword(e.target.value)} value={password}     class="form-control" />
        <label class="form-label" for="loginPassword">Password</label>
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

               {/* <form className="login" onSubmit={handleSubmit}>
          <h3>Log In</h3>
          
          <label>Email address:</label><br/>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          /> <br/>
          <label>Password:</label><br/>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}   
          />
          <br/>
          <button disabled={isLoading}>Log in</button>
          {error && <div className="error">{error}</div>}
        </form> */}      
      </div>
  
      )
    
}

export default Login;