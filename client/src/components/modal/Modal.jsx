

import React from "react";import { useContext,useState,componentDidUpdate } from 'react';
import { useEffect } from 'react';
import { getComments,postComment } from '../../api/CommentsRequests';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../Comments/Comments';
import './modal.css';
import profilePicture from "../../images/profile.jpg"
import { Avatar} from "@mui/material";
import {format} from "timeago.js";



const Modal = ({ open, onClose, projectData, user,insertComments,fromCom, commentsCount}) =>{
    let { dispatch} = useContext(AuthContext);
    const [comments,setComments] = useState(null);
    const [comment,setComment] = useState(null);
    let prev = "";
    useEffect(() =>{
   
      if(insertComments){
        //fetch comments
        projectData && fetchComments()
        prev = projectData
      }
    },[projectData]);
    
    const fetchComments = async() =>{
      let foundComments = "" 
      if(fromCom === 'postDetails'){
        foundComments = await getComments(projectData._id,dispatch);
      }else{
        foundComments = await getComments(projectData.postId,dispatch);
      }
     
      console.log(foundComments);
      if(foundComments.length > 0){
        setComments(foundComments)
        commentsCount(foundComments.length)
      }
    }

    if (!open) return null;

    const convertBinaryToString = (image)=>{
        
        
      const base64String = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
      }, ''));
          
      return base64String
  }


   const submitComment = async() =>{
      let commentResponse = ""
      if(fromCom === 'postDetails'){
        commentResponse = await postComment(comment,projectData._id);
      }else{
        commentResponse = await postComment(comment,projectData.postId); 
      }
      if(commentResponse){
          //reload post
       
          fetchComments()
      }
      setComment("");
   }
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=' modalContainer modal'
      >
        
        <div className="modal__header">
        <h5 class="modal-title text-center">{user.name}'s post</h5>  
       
          
       <span className='closeBtnModal'  onClick={onClose}>x</span> 
       
        </div>
    <div className="modal__content">
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
                          
        <p className="profile-name">{user && user.name}</p>
        <span className="postTime">{format(projectData.createdAt)}</span>
           
      </div>
      <p className="projectName">{projectData && projectData.projectName}</p>  
    <p className="postDescription">{projectData && projectData.desc}</p>
    <hr/>
    <Comments fetchComments={fetchComments} postId={projectData._id} comments={comments} />
    </div>
    <div className="modal__footer">
      <form  className="comment-form " >   
        <br/>
          <textarea placeholder="write commment" className='comment-input'
            onChange={(e) => setComment(e.target.value)}
           value={comment}
          ></textarea>
          <br/>
          <p  className="pressEnter" onClick={submitComment}>Click to submit</p>
          {/* <button className='comment-btn'>Comment</button> */}
      </form>
    </div>
      </div>
      
    </div>
    )
}

export default Modal;