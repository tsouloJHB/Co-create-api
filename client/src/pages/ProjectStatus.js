import { useLocation } from "react-router-dom";
import { getUsers} from "../api/GetUsers";
import { useEffect, useState} from "react";
import { AuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout'
import { useContext } from "react";
import {getJoinRequest} from "../api/JoinRequest";

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
        <div>
            <h4>Project status</h4>
            
           <p>{project.projectName}</p>
           <p>{project.desc}</p>
           <p>Outstanding members: { project.maxMembers - project.members.length}</p>
           <p>Current Members: {project.members.length}</p>
            <h5>Side bar</h5>
             {/* {members && members.name} */}

        {members && members.length > 0 ? members.map((item,index) => (
          <li key={index}>
            {item._id === project.userId?"Group leader":"" }
            <p>{item.name}</p>
            
          </li>
        )) : ""}
    
        </div>
    );
}

export default ProjectStatus