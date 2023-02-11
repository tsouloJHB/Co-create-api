
import { useLocation } from "react-router-dom";
import {format} from "timeago.js";

import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getUsers } from "../api/GetUsers";
import { useLogout } from '../hooks/useLogout'
import { AuthContext } from '../context/AuthContext';
import profilePicture from "../images/profile.jpg"
import EditModal from "../components/EditModal/EditModal";
import { removeUser } from "../api/ProjectRequest";
import { getProjectByPostId } from "../api/ProjectRequest";

const ProjectEdit = () =>{
    // const location = useLocation();
    // const { state } = location.state;
    let { state } = useLocation();
    let {user, dispatch} = useContext(AuthContext);
    const [users,setUsers] = useState(null)
    const {logout} = useLogout();
    const [openModal, setOpenModal] = useState(false);
    const [editField,setEditField] = useState(null)
    const [fieldData,setFieldData] = useState(null)
    const [project,setProject] = useState(null) 
    
    useEffect(()=>{
        console.log(state.members)  
        getProject(); 
       
    },[]);

    const getProfiles = async(foundProject) =>{
 
        const newUsers = foundProject.members.filter((member) =>  member !== user.user);
       
        if(newUsers.length > 0){
            const users = await getUsers(newUsers,dispatch,logout);
       
            setUsers(users)
        }
        
    
    }
    //get project
    const getProject = async() =>{
        const foundProject = await getProjectByPostId(state.postId,user,dispatch,logout);
 
        if(foundProject){
            console.log(foundProject)
            setProject(foundProject)
            getProfiles(foundProject)
        }

    }


    const convertBinaryToString = (image)=>{
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }
    
    const handleEdit = (field) =>{
        Object.keys(state).map(key => {
            if(key === field) 
            {
                setFieldData(state[key])    
                return state[key]
            }
            return ""
        }) 
        setEditField(field)
        setOpenModal(true)
    }

    const updateState = (data) => {
        state = data;
        console.log(state);
    }
    const handleRemoveUser = async(data) => {

        const deleteUser = await removeUser(data._id,state._id,dispatch,logout);
        if(deleteUser){
            const newUsers = users.filter((user) => user._id !== data._id);
            console.log(newUsers)
            setUsers(newUsers)
            //parent state project
            
            //edit state
            const newMembers = state.members.filter((member) =>  member !== data._id);
            state.members = newMembers
            console.log(state.members)

        }
      
       
    }
    return (
        <div   onClick={() => setOpenModal(false)}>
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
            <h3>{state.userId === user.user ? <><h2>{state.projectName} </h2><button onClick={() => handleEdit("projectName")} >Edit</button></>:<h2>{state.projectName} </h2>}</h3>
            <div >Project Status {state.userId === user.user ? <><p>{state.status} </p><button onClick={() => handleEdit("status")} >Start Project</button></>:""}</div>
            <div>{state.userId !== user.user ? <p>state.desc </p>:<><p>{state.desc}</p> <button onClick={() => handleEdit("desc")}>Edit</button></>}</div>
            <p>{state.maxMembers - state.members.length  +" "} {state &&  state.maxMembers - state.members.length === 1 ?"Space left":"Spaces left"}</p>
             <p>Members</p>
            
             {
                state.userId !== user.user ? <div><button>Exit group </button></div>:""
            }
            {
                users && <p>{users.length}</p>
            }
            {
               users  && users.length > 0?
                 users.map(LocalUser =>(
                    <div key={LocalUser._id}>
                     
                     {LocalUser.image && LocalUser.image.data && LocalUser.image.data.data !== null ? <div><img alt={LocalUser.name} src={`data:image/png;base64,${convertBinaryToString(LocalUser.image)}`}/> </div>:<div><img alt="fds" src={profilePicture}/></div>}    
                    <p>{LocalUser.name} {LocalUser.surname}</p>
                    <button onClick={() => handleRemoveUser(LocalUser)}>Remove User</button>
                    </div>
                )):"NO members yet"
            }


            <EditModal 
                open={openModal} 
                onClose={() => setOpenModal(false)}
                projectData={state}
                fieldName={editField}
                fieldData={ fieldData  }
                updateState={updateState}
            />

        </div>
        </div>
    )

}

export default ProjectEdit