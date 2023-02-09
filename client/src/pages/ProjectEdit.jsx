
import { useLocation } from "react-router-dom";
import {format} from "timeago.js";

import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getUsers } from "../api/GetUsers";
import { useLogout } from '../hooks/useLogout'
import { AuthContext } from '../context/AuthContext';
import profilePicture from "../images/profile.jpg"

const ProjectEdit = () =>{
    // const location = useLocation();
    // const { state } = location.state;
    const { state } = useLocation();
    let {user, dispatch} = useContext(AuthContext);
    const [users,setUsers] = useState(null)
    const {logout} = useLogout();
    
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

    return (
        <div>
            <h3>{state.userId === user.user ? <><h2>{state.projectName} </h2><button>Edit</button></>:<h2>{state.projectName} </h2>}</h3>
            <div>Project Status {state.userId === user.user ? <><p>{state.status} </p><button>Start Project</button></>:""}</div>
            <div>{state.userId !== user.user ? <p>state.desc </p>:<><p>{state.desc}</p> <button>Edit</button></>}</div>
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

        </div>
    )

}

export default ProjectEdit