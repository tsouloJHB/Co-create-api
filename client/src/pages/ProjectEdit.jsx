
import { useLocation } from "react-router-dom";
import {format} from "timeago.js";

import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getUsers } from "../api/GetUsers";
import { useLogout } from '../hooks/useLogout'
import { AuthContext } from '../context/AuthContext';
import profilePicture from "../images/profile.jpg"
import EditModal from "../components/EditModal/EditModal";

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
    
    useEffect(()=>{
           
         state && getProfiles()
    },[]);

    const getProfiles = async() =>{
        const users = await getUsers(state.members,dispatch,logout);
        setUsers(users)
    
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
               state.members.length > 0?
                users  &&  users.map(LocalUser =>(
                    <div key={LocalUser._id}>
                          
                     {LocalUser.image.data && LocalUser.image.data.data !== null ? <div><img alt={LocalUser.name} src={`data:image/png;base64,${convertBinaryToString(LocalUser.image)}`}/> </div>:<div><img alt="fds" src={profilePicture}/></div>}    
                    <p>{LocalUser.name} {LocalUser.surname}</p>
                    </div>
                )):"NO members yet"
            }

            {
                state.userId !== user.user ? <div><button>Exit group </button></div>:"Remove users"
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