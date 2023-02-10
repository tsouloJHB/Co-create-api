
import { useContext,useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { postComment } from '../../api/CommentsRequests';
import profilePicture from "../../images/profile.jpg"

const Comments = ({ fetchComments,postId,comments}) => {
    let { dispatch} = useContext(AuthContext);
    const [comment,setComment] = useState(null);
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
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }

    return (
        <div>
            <div>{comments && comments.map((comment)=>(
                <div key={comment.comment._id}>
                    { comment.user.image.data.data !== null ? <img alt={comment.user.name} src={`data:image/png;base64,${convertBinaryToString(comment.user.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                    <p>{comment.user.name}</p>
                    <p>{comment.comment.text}</p>
                </div>
            ))}
            </div>
            <div>
        
           <form onSubmit={handleSubmit}>   
           <br/>
                <textarea cols='35' rows='2'
                 onChange={(e) => setComment(e.target.value)}
                 
                ></textarea>
                <br/>
                <button>Comment</button>
           </form>
            </div>
        </div>
    )
}

export default Comments;