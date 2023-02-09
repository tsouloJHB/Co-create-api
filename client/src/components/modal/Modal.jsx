
import { useContext,useState } from 'react';
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
        className='modalContainer'
      >
        
       
        <div className='modalRight'>
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