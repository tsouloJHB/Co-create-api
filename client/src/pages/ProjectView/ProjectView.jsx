import React from "react";
import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { getUsers} from "../../api/GetUsers";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'
import { useContext } from "react";
import MessagesPanel from "../../components/messagePanel/MessagesPanel";
import { Avatar } from "@mui/material";
import { convertBinaryToString} from "../../utils/ImageFormating"
import "./ProjectView.css"
import profilePicture from "../../images/profile.jpg"

const ProjectView = () => {
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const location = useLocation();
    const { project } = location.state;
    const [members,setMembers] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState(null);

    useEffect(()=>{       
        const getData = async() =>{
           const response = await getUsers(project.members,dispatch,logout);
            setMembers(response)
        }
       getData();
        
    },[]);
  
    if (!members) {
        return <p>Loading...</p>;
      }

    const updateOnlineUsers = (users) =>{
      setOnlineUsers(users)
      console.log(users);
    }  

    return (  
      <div className="container">
         <div className="left-sidebar-view ">
          
         <p className="projectNameView">{project.projectName}</p>
         <hr/>
         <div className="projectDescription">
           <p>{project.desc}</p>
        
           <p>Members no: {project.members.length}</p>
         </div> 
      
        {members.map((item,index) => (
          <div className="projectUser" key={index}>
           
          
            { item.image !== undefined ?
            <Avatar className="photo" src={`data:image/png;base64,${convertBinaryToString(item.image)}`} alt="" sx={{
                                width: 48,
                                height: 48,
                                
                            }} />:
                        
            <Avatar src={profilePicture} alt="" sx={{
                                width: 48,
                                height: 48,
                            }} />
                          }
              {onlineUsers && onlineUsers.find(profile=> profile.userId === item._id) !== undefined 
                ? <span class="dotOnline"></span> 
                : <span class="dotOffline"></span> 
              }            
                        
              <p>{item.name}  {item._id === project.userId?"Group leader":"" }</p>
              {/* {onlineUsers && console.log(onlineUsers.find(profile=> profile.userId === item._id) !== undefined)} */}
          </div>
          
        ))}
         </div>
            <div className="middle-cover middle-project-view">
          
     
       {project &&  <MessagesPanel project={project} updateOnlineUsers={updateOnlineUsers} /> }
        </div>  
      </div>  
    );

}
 
export default ProjectView;
