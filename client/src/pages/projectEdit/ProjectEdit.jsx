
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Avatar, IconButton, Tooltip, Button } from "@mui/material";
import { convertBinaryToString} from "../../utils/ImageFormating"
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


    // const convertBinaryToString = (image)=>{
      
    //     const base64String = btoa(
    //         String.fromCharCode(...new Uint8Array(image.data.data) )
    //     );
            
    //     return base64String
    // }
    
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
            <div className="left-sidebar leftProjectEdit" onClick={(e) => {
            e.stopPropagation();
            }}>
            {state.postId && state.userId === user.user ? <SideAcceptUsers updateMembers={updateMembers} updateParentUser={updateParentUser} postId={state.postId} />:""}
            </div>
            <div  className="middle-cover" onClick={(e) => {
            e.stopPropagation();
            }}>
             
                <p className="yourProject">Edit project</p>
                <div className="content-row project-row">
                    

                <div className="content-data" >{state.userId === user.user ?
                 <><p>{state.projectName} </p><AddCircleIcon className="save-button"   sx={{ cursor: 'pointer'}} onClick={() => handleEdit("projectName")} color="primary" /></>
                 :<p>{state.projectName} </p>}
                </div>

                <div className="content-data">Project Status {state.userId === user.user 
                    ? <><p>{state.status} </p> <AddCircleIcon className="save-button"   sx={{ cursor: 'pointer'}} onClick={() => handleEdit("status")} color="primary" /></>
                    :""}
                </div>
                <div className="content-data">
                    {state.userId !== user.user 
                    ? <p>{state.desc} </p>
                    :<div ><p>{state.desc}</p>  <AddCircleIcon className="save-button"   sx={{ cursor: 'pointer'}} onClick={() => handleEdit("desc")} color="primary" /></div>}
                </div>
                 <div className="content-data">
                <p> {state &&  membersCount === 1 ?"Space left":"Spaces left"} {" "+membersCount }</p>
                </div>
                <div className="content-data">
                <p>Current Members {" "}:</p>
            
                {
                    users && <p> {" "+users.length}</p>
                }
                </div>
                <div className="content-data">
                {
                users  && users.length > 0?
                    users.map(LocalUser =>(
                        <div key={LocalUser._id}>
                       <div className="profile-info">  
                        {LocalUser.image && LocalUser.image.data && LocalUser.image.data.data !== null ? 
                        <div><Avatar className="profile-pic" src={`data:image/png;base64,${convertBinaryToString(LocalUser.image)}`} alt="" sx={{
                            width: 48,
                            height: 48,
                            
                        }} /></div>
                        :<div> <Avatar className="profile-pic" src={profilePicture} alt="" sx={{
                            width: 48,
                            height: 48,
                            
                        }} /></div>}
                          
                        <p>{LocalUser.name} {LocalUser.surname}</p>
                        <Button variant="outlined" color="success" onClick={() => handleViewProfile(LocalUser)}  >View profile</Button>
                      
                        {state.userId === user.user ?
                        <Button variant="outlined" color="success"  onClick={() => handleRemoveUser(LocalUser)}  >Remove User</Button>
                        
                          :""}
                        </div>
                        </div>
                        
                    )):"NO members yet"
                }

</div>
                <div className="content-data">
                {
                    state.userId === user.user ?
                    
                     <div><Button variant="outlined" color="success" onClick={handleDeleteProject}  >Delete Project</Button></div>
                     :""
                }
                
                {
                    state.userId !== user.user ? <div><button onClick={handleExitProject}>Exit group </button></div>:""
                }
                </div>
               
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