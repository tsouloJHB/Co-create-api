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
import GroupsIcon from '@mui/icons-material/Groups';
import { Avatar } from "@mui/material";
import profilePicture from "../../images/profile.jpg"
import { convertBinaryToString} from "../../utils/ImageFormating"
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"
import { color } from "@mui/system";
import { blue } from "@mui/material/colors";

const Navbar = () => {
   const {logout} = useLogout();
   const {user,dispatch} = useAuthContext();
   const [profileUser,setProfileUser] = useState(null)
   const navigate = useNavigate();
   
   useEffect(()=>{
    getUserData()
  },[user]);
  

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
    // navigate("/login");   
   }
    return (
      <nav>
      <div class="nav-left">
       
          <h3 className="logo-name">CO-CREATE</h3>
    
         
      </div>
      <div class="nav-middle">
      { user && (<>
        <div className="link-group">
          <Link className="nav-link" to="/posts">
          <FontAwesomeIcon className="homeButton" icon={faHouse} />
          <p>Home</p>   
          </Link>
        </div>

        <div className="link-group">
          <Link className="nav-link" to="/projects">
          {/* <FontAwesomeIcon className="homeButton" size="1x" icon={faDiagramProject} /> */}
          <GroupsIcon className="projectButton" color="primary" sx={{fontSize:30,color:'gray'}} />
          <p>Projects</p> 
          </Link>
        </div>
       
        </>)}
      </div>                  
      <div class="nav-right">
              { user && (<>
                <Link to="/profile">
               
              { profileUser && Object.keys(profileUser.image).length !== 0 ?
                  <Avatar className="photo-nav" src={`data:image/png;base64,${convertBinaryToString(profileUser.image)}`} alt="" sx={{
                      width: 28,
                      height: 28,
                      
                  }} />:
              
                  <Avatar className="photo-nav" src={profilePicture} alt="" sx={{
                      width: 28,
                      height: 28,
                  }} />
              }
              </Link>
              <hr/>
               {user && (
              <div className="">
                {/* <span>{ profileUser && profileUser.name}</span> */}
                {/* <Link to="/profile">Profile</Link> */}
               
                  {/* <Link to="/projects">Projects</Link>
                  <Link to="/projects">Project request</Link>
                  <Link to="/posts">Your Project post</Link> */}
                <LogoutIcon onClick={handleClick}  color="primary" sx={{
                            width: 22,
                            height: 22,
                            cursor:"pointer"
                        }} />
                 
                {/* <button onClick={handleClick}  >Log out</button> */}
              </div>
            )}
              </>)}
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