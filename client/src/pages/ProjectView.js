
import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { getUsers} from "../api/GetUsers";
import { AuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout'
import { useContext } from "react";
import MessagesPanel from "../components/messagePanel/MessagesPanel";

const ProjectView = () => {
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const location = useLocation();
    const { project } = location.state;
    const [members,setMembers] = useState(null);

    useEffect(()=>{       
        const getData = async() =>{
           const response = await getUsers(user,project.members,dispatch,logout);
            setMembers(response)
        }
       getData();
        
    },[]);
  
    if (!members) {
        return <p>Loading...</p>;
      }

    return (  
        <div>
    
           <p>{project.projectName}</p>
           <p>{project.desc}</p>
           <p>Members no: {project.members.length}</p>
            <h5>Side bar</h5>
             {/* {members && members.name} */}

        {members.map((item,index) => (
          <li key={index}>
            {item._id === project.userId?"Group leader":"" }
            <p>{item.name}</p>
            
          </li>
        ))}
     
       {project &&  <MessagesPanel project={project} /> }
        </div>  
    );

}
 
export default ProjectView;
