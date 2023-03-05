import React from "react";
import {useContext, useEffect,useState } from "react";
import { getProjectJoinRequest, acceptUser} from "../../api/ProjectRequest";
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';  
import profilePicture from "../../images/profile.jpg"


const SideAcceptUsers = ({updateMembers,updateParentUser,postId}) =>{
    const [joinRequests,setJoinRequests] = useState(null);
    let { user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();

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

      
    }

    return (
        <div>
      
            <h3>Project join request </h3>
            {
                joinRequests && joinRequests.map(join =>(
                    <div key={join.joinId} className="workout-details" >

                    {join.image && join.image.data && join.image.data.data !== null ? <img alt={join.name} src={`data:image/png;base64,${convertBinaryToString(join.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                    <p>{join.name + " "}{join.surname} </p>
                    <button onClick={() => handleAcceptUser(join,'Accepted')} >Accept</button>
                    <button  onClick={() => handleAcceptUser(join,'Rejected')}>Reject</button>
                    </div>
                ))  
            }
            </div>
        
    )
}

export default SideAcceptUsers