import React from "react";
import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';
import { updateProject } from '../../api/ProjectRequest';
import profilePicture from "../../images/profile.jpg"

import './modal.css';


const ProfileModal = ({ open, onClose, user}) =>{
    let { dispatch} = useContext(AuthContext);
    const [field,setField] = useState(null);
    const {logout} = useLogout();
    
  


    const handleClick = async() =>{
        
       
        
    }

    if (!open) return null;

    const convertBinaryToString = (image)=>{
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }
  
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        
       
        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <h3>Profile</h3>
            <br/>
            {user.image && user.image.data && user.image.data.data !== null ? <div><img alt={user.name} src={`data:image/png;base64,${convertBinaryToString(user.image)}`}/> </div>:<div><img alt="fds" src={profilePicture}/></div>}    
            <p>{user.name} {user.surname}</p>
            <p>{user.desc}</p>
            <p>Occupation: {user.occupation}</p>
            <p>From: {user.city}</p>      
         

          </div>
          
        </div>
      </div>
    </div>
    )
}

export default ProfileModal;