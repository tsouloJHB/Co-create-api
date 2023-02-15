import { useContext} from "react";

import { AuthContext } from '../../context/AuthContext';
import { Navigate } from "react-router-dom";
import {format} from "timeago.js";
import ProjectView from "../../pages/ProjectView";
import { Link } from 'react-router-dom';
import ProjectEdit from "../../pages/ProjectEdit";
import { useNavigate } from 'react-router-dom';


const ProjectDetails = ({project}) => {
    const navigate = useNavigate();
    let { user ,dispatch} = useContext(AuthContext);
   
    
    const handleClick = () =>{
        navigate("/projectEdit",{state:project});     
    }

    return ( 
        <div className="workout-details">
            <h4>{project.projectName}</h4>
            <p>{project.desc}{project.desc}</p>
            <p>{project.status}</p>
            <p>Created {format(project.createdAt)} </p>
            {project.status === "InProgress"? <Link to="/projectView" state={{ project: project } }>Open</Link>  :""}
            {project.status === "NotStarted"? <Link to="/projectStatus" state={{ project: project } }>Project status</Link>  :""}
            &nbsp;
            <button onClick={handleClick}>Settings</button>
            {project.userId === user.user?"Your project":""}
            {/* {project && <Link to="/projectEdit" state={{ state: project } }>Settings</Link>  } */}
             
        </div>
     );
}
 
export default ProjectDetails;