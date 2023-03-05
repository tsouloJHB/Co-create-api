import React from "react";
import { useState } from "react"
import { useSignup } from "../hooks/useSignup";


const Signup = () => {
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [name,setName] = useState(null);
    const {signup,error,isLoading} = useSignup();
    
    const handleSubmit = async(e)=>{
      e.preventDefault()
      await signup(name,email,password)
    }
  
    return (
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        
        <label>Email address:</label>
        <input 
          type="text" 
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input 
          type="email" 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
          
        <label>Password:</label>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
  
        <button disabled={isLoading}>Sign up</button>
        {error && <div className="error">{error}</div> }
      </form>
    )
  }
  
  export default Signup