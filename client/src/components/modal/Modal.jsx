
import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getComments } from '../../api/CommentsRequests';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../Comments';
import './modal.css';


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
      if(foundComments.length > 0)  setComments(foundComments)
     
   
    }

    if (!open) return null;
   
  
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