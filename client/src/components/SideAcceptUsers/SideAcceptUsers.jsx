import React from "react";
import {useContext, useEffect,useState } from "react";
import { getProjectJoinRequest, acceptUser} from "../../api/ProjectRequest";
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';  
import profilePicture from "../../images/profile.jpg"
import { Avatar,Button } from "@mui/material";
import SnackBar from "../snackbar/SnackBar";
import './SideAcceptUsers.css'

const SideAcceptUsers = ({updateMembers,updateParentUser,postId}) =>{
    const [joinRequests,setJoinRequests] = useState(null);
    let { user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [triggerSnackBar, setTriggerSnackBar] = useState(0);
    const [snackbarMessage ,setSnackBarMessage] = useState("")

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

    return (
        <div className="post-border">
      
            
            <p className="yourProject">Project join request</p>
            {
                joinRequests && joinRequests.map(join =>(
                    <div key={join.joinId} className="workout-details" >
                     
                    {join.image && join.image.data && join.image.data.data !== null ? 
                    <Avatar className="profile-pic-accept" src={`data:image/png;base64,${convertBinaryToString(join.image.data)}`} alt="" sx={{
                        width: 48,
                        height: 48,
                        
                    }} />
                    : <Avatar className="profile-pic-accept" src={profilePicture} alt="" sx={{
                        width: 48,
                        height: 48,
                        
                    }} />}
                    <p className="side-name">{join.name + " "}{join.surname} </p>
                    <Button variant="outlined" color="success"  onClick={() => handleAcceptUser(join,'Accepted')}  >Accept</Button>
                    <Button variant="outlined" color="success"   onClick={() => handleAcceptUser(join,'Rejected')}  >Rejected</Button>
                    <hr />
                    </div>
                  
                ))
               
               
            }
             {joinRequests && joinRequests.length === 0 ? "No request":""}
             <SnackBar message={snackbarMessage} trigger={triggerSnackBar} />
            </div>
        
    )
}

export default SideAcceptUsers