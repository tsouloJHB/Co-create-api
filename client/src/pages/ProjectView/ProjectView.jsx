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

    return (  
      <div className="container">
         <div className="left-sidebar-view">
          
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
              <span class="dotOnline"></span>            
              <p>{item.name}  {item._id === project.userId?"Group leader":"" }</p>
          </div>
          
        ))}
         </div>
            <div className="middle-cover">
          
     
       {project &&  <MessagesPanel project={project} /> }
        </div>  
      </div>  
    );

}
 
export default ProjectView;
