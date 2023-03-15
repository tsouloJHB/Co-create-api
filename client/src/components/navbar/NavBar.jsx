import React from "react";
import { useEffect ,useState} from 'react';
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout'
import { getUser } from '../../api/GetUsers';
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import LogoutIcon from '@mui/icons-material/Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faHouse,faDiagramProject} from '@fortawesome/free-solid-svg-icons'

import "./Navbar.css"

const Navbar = () => {
   const {logout} = useLogout();
   const {user,dispatch} = useAuthContext();
   const [profileUser,setProfileUser] = useState(null)
   
   useEffect(()=>{
    getUserData()
  },[]);
  

    const getUserData = async() =>{
        const users = JSON.parse(localStorage.getItem('user'))
        if(users){
          const foundUser = await getUser(users.user,dispatch,logout)
          console.log("here")
          if(foundUser) setProfileUser(foundUser)
        }
   
       
    }

   const handleClick = () =>{
    logout();
   }
    return (
      <nav>
      <div class="nav-left">
       
          <h3 className="logo-name">Co-create</h3>
    
         
      </div>
      <div class="nav-middle">
        <Link to="/posts">
        <FontAwesomeIcon className="homeButton" size="1x" icon={faHouse} />
        </Link>
        <Link to="/projects">
        <FontAwesomeIcon className="homeButton" size="1x" icon={faDiagramProject} />
         
        </Link>
      </div>                  
      <div class="nav-right">
        
            
              <hr/>
               {user && (
              <div>
                <span>{ profileUser && profileUser.name}</span>
                <Link to="/profile">Profile</Link>
                  {/* <Link to="/projects">Projects</Link>
                  <Link to="/projects">Project request</Link>
                  <Link to="/posts">Your Project post</Link> */}
                <LogoutIcon onClick={handleClick}  color="primary" sx={{
                            width: 38,
                            height: 38,
                            
                        }} />
                {/* <button onClick={handleClick}  >Log out</button> */}
              </div>
            )}
            {!user && (
              <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            )}
          </div>
 
    
  </nav>
      // <header>
      //   <div className="container">
      //     <Link to="/">
      //       <h1>Co-create</h1>
      //     </Link>
      //     <nav>
      //       {user && (
      //         <div>
      //           <span>{ profileUser && profileUser.name}</span>
      //           <Link to="/profile">Profile</Link>
      //           <Link to="/projects">Projects</Link>
      //           <Link to="/projects">Project request</Link>
      //           <Link to="/posts">Your Project post</Link>
      //           <button onClick={handleClick} >Log out</button>
      //         </div>
      //       )}
      //       {!user && (
      //         <div>
      //           <Link to="/login">Login</Link>
      //           <Link to="/signup">Signup</Link>
      //         </div>
      //       )}
      //     </nav>
      //   </div>
      // </header>
    )
  }
  
  export default Navbar