import { Navigate } from "react-router-dom";
import {format} from "timeago.js";
import ProjectView from "../../pages/ProjectView";
import { Link } from 'react-router-dom';


const ProjectDetails = ({project}) => {

    const handleClick = () =>{
        
    }

    return ( 
        <div className="workout-details">
            <h4>{project.projectName}</h4>
            <p>{project.desc}</p>
            <p>{project.status}</p>
            <p>Created {format(project.createdAt)} </p>
            {project.status === "InProgress"? <Link to="/projectView" state={{ project: project } }>View Project</Link>  :""}
            {project.status === "NotStarted"? <Link to="/projectStatus" state={{ project: project } }>Project status</Link>  :""}
             
        </div>
     );
}
 
export default ProjectDetails;