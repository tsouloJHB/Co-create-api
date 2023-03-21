import React from "react";
import {useContext, useEffect,useState } from "react";
import { getProjectJoinRequest, acceptUser} from "../../api/ProjectRequest";
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';  
import profilePicture from "../../images/profile.jpg"
import { Avatar,Button } from "@mui/material";
import SnackBar from "../snackbar/SnackBar";
import ProfileModal from "../profileModal/ProfileModal";
import { faTrash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SideAcceptUsers.css'

const SideAcceptUsers = ({updateMembers,updateParentUser,postId}) =>{
    const [joinRequests,setJoinRequests] = useState(null);
    let { user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [triggerSnackBar, setTriggerSnackBar] = useState(0);
    const [snackbarMessage ,setSnackBarMessage] = useState("")
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(()=>{
        console.log(postId)
        fetchJoinRequest();
    },[])

    const fetchJoinRequest = async() =>{
        const request = await getProjectJoinRequest(postId,dispatch,logout)
        const newRequest = request.filter(req => req.status !== 'Rejected');
        console.log(request)
        setJoinRequests(newRequest)
    }

    const convertBinaryToString = (image)=>{
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }

    const handleAcceptUser = async(join,status) =>{
       
        if(status === 'Accepted'){
            console.log('Accepted');
            const accept = await acceptUser(postId,join.joinId,"Accepted",dispatch,logout)
            if(accept){
                const newJoinRequests = joinRequests.filter(fJoin => fJoin.joinId !== join.joinId);
                setJoinRequests(newJoinRequests);
                //update parent 
                updateParentUser()
                updateMembers()
            } 
        }else if(status === 'Rejected'){
            console.log('rejected');
            const reject = await acceptUser(postId,join.joinId,"Rejected",dispatch,logout)
            if(reject){
                const newJoinRequests = joinRequests.filter(fJoin => fJoin.joinId !== join.joinId);
                setJoinRequests(newJoinRequests);
            }
        }
        setSnackBarMessage("User "+status)
        setTriggerSnackBar((triggerSnackBar) => triggerSnackBar + 1);

      
    }

    const handleViewProfile = async(user) => {
        setProfile(user)
        setOpenProfileModal(true)
        
    }

    return (
        <div className="post-border">
      
            
            <p className="yourProject">Project join request</p>
            {joinRequests && console.log(joinRequests)} 
            {
                joinRequests && joinRequests.map(join =>(
                    <div key={join.joinId} className="workout-details" >
                    {console.log(join)} 
                    {join.image && join.image.data && join.image.data.data !== null ? 
                    <Avatar onClick={(e) => handleViewProfile(join)} className="profile-pic-accept" src={`data:image/png;base64,${convertBinaryToString(join.image.data)}`} alt="" sx={{
                        width: 48,
                        height: 48,         
                        cursor:"pointer"
                    }} />
                    : <Avatar onClick={(e) => handleViewProfile(join)} className="profile-pic-accept" src={profilePicture} alt="" sx={{
                        width: 48,
                        height: 48,
                        cursor:"pointer"
                    }} />}
                    <p className="side-name">{join.name + " "}{join.surname} </p>
                    <Button variant="outlined" color="success"  class="btn btn-primary"  onClick={() => handleAcceptUser(join,'Accepted')}  >Accept</Button>
                    <FontAwesomeIcon className="deleteButton-side" icon={faTrash} onClick={() => handleAcceptUser(join,'Rejected')} />
                    {/* <Button variant="outlined" color="success"  class="btn btn-danger"  onClick={() => handleAcceptUser(join,'Rejected')}  >Rejected</Button> */}
                    <hr />
                    </div>
                  
                ))
               
               
            }
             {joinRequests && joinRequests.length === 0 ? "No request":""}
             <SnackBar message={snackbarMessage} trigger={triggerSnackBar} />
             <ProfileModal 
                    open={openProfileModal} 
                    onClose={() => setOpenProfileModal(false)}
                    user={profile}
                    modalLocation="post"
                />
            </div>
        
    )
}

export default SideAcceptUsers