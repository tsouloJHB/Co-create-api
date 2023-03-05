

import React from "react";import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getComments } from '../../api/CommentsRequests';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../Comments/Comments';
import './modal.css';
import profilePicture from "../../images/profile.jpg"
import { Avatar} from "@mui/material";

const Modal = ({ open, onClose, projectData, user,insertComments}) =>{
    let { dispatch} = useContext(AuthContext);
    const [comments,setComments] = useState(null);

    useEffect(() =>{
      
      if(insertComments){
        //fetch comments
        projectData && fetchComments()
      }
    },[]);
    
    const fetchComments = async() =>{
      const foundComments = await getComments(projectData._id,dispatch);
      console.log(foundComments);
      if(foundComments.length > 0)  setComments(foundComments)
     
   
    }

    if (!open) return null;

    const convertBinaryToString = (image)=>{
      
      const base64String =  btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
          
      return base64String
  }
  
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=' modalContainer modal'
      >
        
        <div class="modal-content">
        <div className='modalRight'>
         
          <div className="modal-header modal-header--sticky">
            

          <h5 class="modal-title text-center">{user.name}'s post</h5>  
       
          
          <span className='closeBtnModal'  onClick={onClose}>x</span> 
          </div>

         
          <div className='modal-body contentModal'>
            <div className="user-profile">
              {user && user.image.data && user.image.data.data !== null ? 
              <Avatar className="profile-pic" src={`data:image/png;base64,${convertBinaryToString(user.image)}`} alt="" sx={{
                width: 48,
                height: 48,
                
            }} />
              :<Avatar src={profilePicture} alt="" sx={{
                width: 48,
                height: 48,
            }} />}
              
                     
                        

                    
              <p>{user && user.name}</p>
              <p>{projectData && projectData.projectName}</p>
            
            </div>
           
              <p>{projectData && projectData.desc}</p>
              <hr/>
          
           
{/* <div class="modal-footer modal-footer--sticky">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
           </div> */}
           
            <div>

          
            {/* <div class="float-end mt-2 pt-1">
              <button type="button" class="btn btn-primary btn-sm">Post comment</button>
              <button type="button" class="btn btn-outline-primary btn-sm">Cancel</button>
            </div> */}
              <Comments fetchComments={fetchComments} postId={projectData._id} comments={comments} />
              </div>
           
          </div>
          
          <div className='modal-footer modal-footer--sticky'>
                <form  className="comment-form " >   
                <br/>
                        <textarea placeholder="write commment" className='comment-input' cols='40 form-control border-0 rounded-pill bg-gray'
                      
                        
                        ></textarea>
                        <br/>
                        <button className='comment-btn'>Comment</button>
                </form>
            </div>
          
         
        </div>
        </div>
      </div>
    </div>
    )
}

export default Modal;