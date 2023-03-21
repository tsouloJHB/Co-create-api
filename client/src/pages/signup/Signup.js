import React from "react";
import { useState } from "react"
import { useSignup } from "../../hooks/useSignup";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import './Signup.css'

const Signup = () => {
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [password2,setPassword2] = useState(null);
    const [name,setName] = useState(null);
    const [surname,setSurname] = useState(null);
    let {signup,error,isLoading} = useSignup();
    const navigate = useNavigate();
    const [frontError, setFrontError] = useState(null) 
    const handleSubmit = async(e)=>{
      e.preventDefault()
      if(password !== password2 ){
        console.log("Password don't match");
        error = "Passwords don't match"
        setFrontError("Passwords don't match")
        return;
      }
      if(password === null || password2 === null ){
        
        setFrontError("Passwords is empty")
        return;
      }
      await signup(name,surname,email,password)
      navigate("/login");
    }
  
    return (



  <div className="px-4 py-5 px-md-5 text-center text-lg-start">
    <div className="container">
      <div className="row gx-lg-5 align-items-center">
        <div className="col-lg-6 mb-5 mb-lg-0">
          <h1 className="my-5 display-3 fw-bold ls-tight">
            The best offer <br />
            <span className="text-primary">for your business</span>
          </h1>
          <p >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eveniet, itaque accusantium odio, soluta, corrupti aliquam
            quibusdam tempora at cupiditate quis eum maiores libero
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>
        </div>

        <div className="col-lg-6 mb-5 mb-lg-0">
          <div className="card">
            <div className="card-body py-5 px-md-5">
              <form onSubmit={handleSubmit}>
             
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <input type="text" id="form3Example1" className="form-control"  onChange={(e) => setName(e.target.value)} value={name}  />
                      <label className="form-label" >First name</label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <input type="text" id="form3Example2" onChange={(e) => setSurname(e.target.value)} className="form-control" value={surname}  />
                      <label className="form-label" >Last name</label>
                    </div>
                  </div>
                </div>

                
                <div className="form-outline mb-4">
                  <input type="email" id="form3Example3" className="form-control"  onChange={(e) => setEmail(e.target.value)} value={email} />
                  <label className="form-label" >Email address</label>
                </div>

                
                <div className="form-outline mb-4">
                  <input type="password" id="form3Example4" className="form-control"  onChange={(e) => setPassword(e.target.value)} />
                  <label className="form-label" >Password</label>
                </div>

                <div className="form-outline mb-4">
                  <input type="password" id="form3Example4" className="form-control"  onChange={(e) => setPassword2(e.target.value)} />
                  <label className="form-label" >Repeat password</label>
                </div>
         
                <div className="form-check d-flex justify-content-center mb-4">
                  <input className="form-check-input me-2" type="checkbox" value="" id="form2Example33" checked />
                  <label className="form-check-label">
                    Subscribe to our newsletter
                  </label>
                </div>

               
                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign up
                </button>

                {frontError && <div classNameName="error">{frontError}</div> }
                <div className="text-center">
                  <p>or  <Link to="/login"> sign in </Link> </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  //       <div classNameName="main-login"> 
  //            <p classNameName="sign" align="center">Sign up</p>
     
  //    <form classNameName="form-login" onSubmit={handleSubmit}>

 
  //    <div className="form-outline mb-4">
  //      <input type="email" id="loginName" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control" />
  //      <label className="form-label" for="loginName">Email or username</label>
  //    </div>

   
  //    <div className="form-outline mb-4">
  //      <input type="password" id="loginPassword"  onChange={(e) => setPassword(e.target.value)} value={password}     className="form-control" />
  //      <label className="form-label" for="loginPassword">Password</label>
  //    </div>

   
  //    <div className="row mb-4">
  //      <div className="col-md-6 d-flex justify-content-center">
       
  //        <div className="form-check mb-3 mb-md-0">
  //          <input className="form-check-input"  type="checkbox" value="" id="loginCheck" checked />
  //          <label className="form-check-label" for="loginCheck"> Remember me </label>
  //        </div>
  //      </div> 

  //      <div className="col-md-6 d-flex justify-content-center">
      
  //        <a href="#!">Forgot password?</a>
  //      </div>
  //    </div>

 
  //    <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

  
  //    <div className="text-center">
  //      <p>Not a member? <Link to="/signup" >Sign up</Link></p>
       
  //    </div>
  //  </form> 
  //       </div>
      // <form classNameName="signup" onSubmit={handleSubmit}>
      //   <h3>Sign Up</h3>
        
      //   <label>Email address:</label>
      //   <input 
      //     type="text" 
      //     onChange={(e) => setName(e.target.value)}
      //     value={name}
      //   />
      //   <input 
      //     type="email" 
      //     onChange={(e) => setEmail(e.target.value)}
      //     value={email}
      //   />
          
      //   <label>Password:</label>
      //   <input 
      //     type="password" 
      //     onChange={(e) => setPassword(e.target.value)}
      //     value={password}
      //   />
  
      //   <button disabled={isLoading}>Sign up</button>
      //   {error && <div classNameName="error">{error}</div> }
      // </form>
    )
  }
  
  export default Signup