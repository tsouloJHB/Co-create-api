import React from "react";
import { useContext} from "react";
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from "react-router-dom";
import {format} from "timeago.js";
import ProjectView from "../../pages/ProjectView/ProjectView";
import { Link } from 'react-router-dom';
import ProjectEdit from "../../pages/projectEdit/ProjectEdit";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import "./projectDetails.css"

const ProjectDetails = ({project}) => {
    const navigate = useNavigate();
    let { user ,dispatch} = useContext(AuthContext);
   
    
    const handleClick = () =>{
        navigate("/projectEdit",{state:project});     
    }

    return ( 
        <div className="post-container">
            <div className="post-row">
                <p className="projectTime">Created {format(project.createdAt)} </p>
            </div>
            <div className="post-row-right">
                <p className="projectTime">{project.status}</p>
                {project.userId === user.user?<span className="projectTime">Your project</span>:""}
            </div>
            <h5>{project.projectName}</h5>
            <br/>
            <p>{project.desc}{project.desc}</p>
            <br/>
 
            {project.status === "InProgress"? <Link to="/projectView" state={{ project: project } }>
              
                <Button variant="outlined" color="success" >Open</Button>
                </Link>  
                :""}
            {project.status === "NotStarted"? <Link to="/projectStatus" state={{ project: project } }>
                <Button variant="outlined" color="success" >    Project status</Button>
            
                </Link>  :""}
            
            &nbsp;
            &nbsp;
            <Button variant="outlined" color="success"  onClick={handleClick} >Settings</Button>
          
           
            {/* {project && <Link to="/projectEdit" state={{ state: project } }>Settings</Link>  } */}
             
        </div>
     );
}
 
export default ProjectDetails;