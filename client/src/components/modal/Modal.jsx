

import React from "react";import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getComments } from '../../api/CommentsRequests';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../Comments/Comments';
import './modal.css';
import profilePicture from "../../images/profile.jpg"

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
        className='modal-content border-0 shadow modalContainer'
      >
        
       
        <div className='modalRight'>
         
          <div className="modal-header">
            <div
              className="dropdown-item d-flex rounded"
              type="button"
              data-bs-container="body"
              data-bs-toggle="popover"
              data-bs-placement="left"
              data-bs-content='
              <div>
                <div className="popover-body d-flex flex-column p-0">
                  <div className="d-flex align-items-center dropdown-item p-2 rounded pointer">
                    <i className="far fa-comment me-3 fs-4"></i>
                    <p className="m-0">Open Messenger App</p>
                  </div>
                  <div className="d-flex align-items-center dropdown-item p-2 rounded pointer">
                    <i className="far fa-user me-3 fs-4"></i>
                    <p className="m-0">Open Messenger App</p>
                  </div>
                  <hr>
                  <div className="d-flex align-items-center dropdown-item p-2 rounded pointer">
                    <i className="fas fa-fill-drip me-3 fs-4"></i>
                    <p className="m-0">Color</p>
                  </div>
                  <div className="d-flex align-items-center dropdown-item p-2 rounded pointer">
                    <i className="far fa-smile-beam me-3 fs-4"></i>
                    <p className="m-0">Emoji</p>
                  </div>
                  <div className="d-flex align-items-center dropdown-item p-2 rounded pointer">
                    <i className="fas fa-pencil-alt me-3 fs-4"></i>
                    <p className="m-0">Nicknames</p>
                  </div>
                </div>
              </div>
              '
              data-bs-html="true"
            >

              <div class="position-relative">
              
                <span
                  className="
                    position-absolute
                    bottom-0
                    translate-middle
                    p-1
                    bg-success
                    border border-light
                    rounded-circle
                  "
                 
                >
                  <span class="visually-hidden">New alerts</span>
                </span>
              </div>
     
              <div>
                <p className="m-0">Mike <i class="fas fa-angle-down"></i></p>
                <span class="text-muted fs-7">Active Now</span>
              </div>
            </div>
    
            <i className="fas fa-video mx-2 text-muted pointer"></i>
            <i className="fas fa-phone-alt mx-2 text-muted pointer"></i>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
          {user && user.image.data && user.image.data.data !== null ? <img alt={user.name} src={`data:image/png;base64,${convertBinaryToString(user.image)}`}/> :<img alt="fds" src={profilePicture}/>}
            <p>{user && user.name}</p>
            <p>{projectData && projectData.projectName}</p>
            <p>{projectData && projectData._id}</p>
            <p>{projectData && projectData.desc}</p>
            <h3>Comments</h3>
            <div class="float-end mt-2 pt-1">
              <button type="button" class="btn btn-primary btn-sm">Post comment</button>
              <button type="button" class="btn btn-outline-primary btn-sm">Cancel</button>
            </div>
            <Comments fetchComments={fetchComments} postId={projectData._id} comments={comments} />
          </div>
          <div className='btnContainer'>
        
          </div>
       
        </div>
      </div>
    </div>
    )
}

export default Modal;