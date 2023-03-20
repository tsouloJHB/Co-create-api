import React from "react";
import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';
import { updateProject } from '../../api/ProjectRequest';
import profilePicture from "../../images/profile.jpg"
import { Avatar } from "@mui/material";

import './modal.css';


const ProfileModal = ({ open, onClose, user,modalLocation}) =>{
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
        className='modalContainer modal'
      >
        
        <div className="modal__header">
        <h5 class="modal-title text-center">Profile</h5>  
       
        {modalLocation === "post" 
        ? <div className='closeBtnModal post-modal'  onClick={onClose}><span>x</span></div> 
        : <div className='closeBtnModal'  onClick={onClose}><span>x</span></div> 
        }   
        
       
        </div>
        <div className='modalRight'>
          {/* <p className='closeBtn' onClick={onClose}>
            X
          </p> */}
          <div className='content'>
            
            <br/>
            {user.image && user.image.data && user.image.data.data !== null 
            ? <div>
               <Avatar className="profile-pic-modal" src={`data:image/png;base64,${convertBinaryToString(user.image)}`} alt="" sx={{
                            width: 218,
                            height: 218,
                            
                        }} />
              </div>
            :<div>
              <Avatar className="profile-pic-modal" src={profilePicture} alt="" sx={{
                            width: 218,
                            height: 218,
                            
                        }} />
           
              </div>
            }    
            <br/><p><b>Name</b> : {user.name} {user.surname}</p>
            <p><b>About :</b> {user.desc ? user.desc : user.bio }</p>
            <p><b>Occupation</b> : {user.occupation}</p>
            <p><b>From</b> : {user.city}</p>      
         

          </div>
          
        </div>
      </div>
    </div>
    )
}

export default ProfileModal;