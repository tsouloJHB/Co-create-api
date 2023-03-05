import React from "react";
import { useContext,useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { postComment } from '../../api/CommentsRequests';
import profilePicture from "../../images/profile.jpg"
import './Comments.css';
import { Avatar} from "@mui/material";

const Comments = ({ fetchComments,postId,comments}) => {
    let { dispatch} = useContext(AuthContext);
    const [comment,setComment] = useState(null);

    if(comments){
        console.log(comments)
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const commentResponse = await postComment(comment,postId);
        console.log(commentResponse
            );
        if(commentResponse){
            //reload post
            setComment("");
            fetchComments()
        }
     }

     const convertBinaryToString = (image)=>{
      
        const base64String = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, '')
        );
            
        return base64String
    }


    return (
        <div className='comments-container'>
         
            <div className='comments'> {comments && comments.map((comment)=>(
                <div className='comment' key={comment.comment._id}>
                    { comment.user.image.data.data !== null ? 
                     <Avatar className="profile-pic" src={`data:image/png;base64,${convertBinaryToString(comment.user.image)}`} alt="" sx={{
                        width: 48,
                        height: 48,
                        
                    }} />
                    :<Avatar src={profilePicture} alt="" sx={{
                        width: 48,
                        height: 48,
                    }} />}
                    <p className='comment-author'>{comment.user.name}</p>
                    <p className='comment-text'>{comment.comment.text}</p>
                </div>
            ))}
            </div>
            <div className="modal-stick">
            <div className=' modal-footer--sticky'>
                <form  className="comment-form " onSubmit={handleSubmit}>   
                <br/>
                        <textarea className='comment-input' cols='70 form-control border-0 rounded-pill bg-gray'
                        onChange={(e) => setComment(e.target.value)}
                        
                        ></textarea>
                        <br/>
                        <button className='comment-btn'>Comment</button>
                </form>
            </div>
            </div>
        </div>
    )
}

export default Comments;