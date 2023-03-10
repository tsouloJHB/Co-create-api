
import React from "react";
import { useLocation,  useNavigate } from "react-router-dom";
import {format} from "timeago.js";

import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getUsers } from "../../api/GetUsers";
import { useLogout } from '../../hooks/useLogout'
import { AuthContext } from '../../context/AuthContext';
import profilePicture from "../../images/profile.jpg"
import EditModal from "../../components/EditModal/EditModal";
import { getProjectByPostId ,removeUser, deleteProject, exitProject } from "../../api/ProjectRequest";
import ProfileModal from "../../components/profileModal/ProfileModal";
import SideAcceptUsers from "../../components/SideAcceptUsers/SideAcceptUsers";
import './ProjectEdit.css';

const ProjectEdit = () =>{
    // const location = useLocation();
    // const { state } = location.state;
    let { state } = useLocation();
    let {user, dispatch} = useContext(AuthContext);
    const [users,setUsers] = useState(null)
    const {logout} = useLogout();
    const [openModal, setOpenModal] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [editField,setEditField] = useState(null)
    const [fieldData,setFieldData] = useState(null)
    const [project,setProject] = useState(null) 
    const [modalUser,setModalUser] = useState(null)
    const navigate = useNavigate();
    const [membersCount,setMembersCount] = useState(0);
    
    useEffect(()=>{
        
        getProject(); 
        setMembersCount(state.maxMembers - state.members.length)
       
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
    const handleViewProfile = async(user) => {
        setModalUser(user)
        setOpenProfileModal(true)
    }
    const closeModals = ()=>{
        setOpenModal(false)
        setOpenProfileModal(false)
    }
    const handleDeleteProject = async() =>{
        const projectDelete = await deleteProject(state._id,dispatch,logout)

        if(projectDelete){
            console.log(state._id)
            navigate(-1)
        }
     
    }
    const updateParentUser = () =>{
        getProject();
    }

    const updateMembers = () =>{
        setMembersCount(membersCount - 1)
    }
    const handleExitProject = async() =>{
        const exitProjectResponse = await exitProject(state._id,dispatch,logout);
        if(exitProjectResponse){
            navigate(-1)
        }
    }
    return (
        <div className="container" onClick={() => closeModals()}>
            <div className="left-sidebar" onClick={(e) => {
            e.stopPropagation();
            }}>
            {state.postId && state.userId === user.user ? <SideAcceptUsers updateMembers={updateMembers} updateParentUser={updateParentUser} postId={state.postId} />:""}
            </div>
            <div  className="middle-cover" onClick={(e) => {
            e.stopPropagation();
            }}>
                <div  >
               
                <h3>{state.userId === user.user ? <><h2>{state.projectName} </h2><button onClick={() => handleEdit("projectName")} >Edit</button></>:<h2>{state.projectName} </h2>}</h3>
                <div >Project Status {state.userId === user.user ? <><p>{state.status} </p><button onClick={() => handleEdit("status")} >Start Project</button></>:""}</div>
                <div>{state.userId !== user.user ? <p>{state.desc} </p>:<><p>{state.desc}</p> <button onClick={() => handleEdit("desc")}>Edit</button></>}</div>
                <p>{membersCount +" "} {state &&  membersCount === 1 ?"Space left":"Spaces left"}</p>
                <p>Members</p>
            
                {
                    users && <p>{users.length}</p>
                }
                {
                users  && users.length > 0?
                    users.map(LocalUser =>(
                        <div key={LocalUser._id}>
                        
                        {LocalUser.image && LocalUser.image.data && LocalUser.image.data.data !== null ? <div><img alt={LocalUser.name} src={`data:image/png;base64,${convertBinaryToString(LocalUser.image)}`}/> </div>:<div><img alt="fds" src={profilePicture}/></div>}    
                        <p>{LocalUser.name} {LocalUser.surname}</p>
                        {state.userId === user.user ? <button onClick={() => handleRemoveUser(LocalUser)}>Remove User</button> :""}
                        <button onClick={() => handleViewProfile(LocalUser)}>View profile</button>
                        </div>
                    )):"NO members yet"
                }

                
                {
                    state.userId === user.user ? <div><button onClick={handleDeleteProject}>Delete Project </button></div>:""
                }
                
                {
                    state.userId !== user.user ? <div><button onClick={handleExitProject}>Exit group </button></div>:""
                }
                <EditModal 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    projectData={state}
                    fieldName={editField}
                    fieldData={ fieldData  }
                    updateState={updateState}
                    fieldType="project"
                />
                <ProfileModal 
                    open={openProfileModal} 
                    onClose={() => setOpenProfileModal(false)}
                    user={modalUser}
                />

            </div>
            </div>
            
        </div>
    )

}

export default ProjectEdit