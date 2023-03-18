import React from "react";
import { useLocation } from "react-router-dom";
import { getUsers} from "../../api/GetUsers";
import { useEffect, useState} from "react";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'
import { useContext } from "react";
import {getJoinRequest} from "../../api/JoinRequest";
import { Avatar, IconButton, Tooltip, Button } from "@mui/material";
import { convertBinaryToString} from "../../utils/ImageFormating"
import "./ProjectStatus.css"
import backGroundImage from  "../../images/reading.jpg"
import profilePicture from "../../images/profile.jpg"

const ProjectStatus = () =>{
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const location = useLocation();
    const { project } = location.state;
    const [members,setMembers] = useState(null);
    const [joinRequest,setJoinRequest] = useState(null);

    useEffect(()=>{       
        console.log(project)
        const getData = async() =>{
           const response = await getUsers(project.members,dispatch,logout);
            setMembers(response)
        }
        //get project join request
        const getJoins = async() =>{
           const joins = await getJoinRequest(project.postId,user,dispatch,logout);
           console.log(joins);
        }   
        getData();
        getJoins();
        
    },[]);
    return (
        <div className="middle-cover">
          <div className="project-status-cover">
          <div className="cover-image">
          <h4><b>Project status</b></h4>
            
            <p><b>Project name</b> : {project.projectName}</p>
            <p><b>Project Description</b> : {project.desc}</p>
            <p><b>Outstanding members</b> : { project.maxMembers - project.members.length}</p>
            <p><b>Current Members</b> : {project.members.length}</p>
             <h5>Side bar</h5>
              {/* {members && members.name} */}
 
         {members && members.length > 0 ? members.map((item,index) => (
           <div key={index}>
           {item._id === project.userId?<><p id="groupName">Group leader</p><br/></>:"" }
           <div className="projectStatus-profiles" >
            
             {item.image !== undefined ? 
                        <div><Avatar className="profile-pic" src={`data:image/png;base64,${convertBinaryToString(item.image)}`} alt="" sx={{
                            width: 48,
                            height: 48,
                            
                        }} /></div>
                        :<div> <Avatar className="profile-pic" src={profilePicture} alt="" sx={{
                            width: 48,
                            height: 48,
                            
              }} /></div>}
             <p>{item.name}</p>
          
           </div>
           </div>
         )) : ""}
          </div>
            <img className="backGroundImage" src={backGroundImage} alt="fdf" width="100px"/>
           
           
        </div>
      </div>
    );
}

export default ProjectStatus