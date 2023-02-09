
import { useLocation } from "react-router-dom";
import {format} from "timeago.js";

import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { getComments } from '../api/CommentsRequests';
import { AuthContext } from '../context/AuthContext';
import Comments from "../components/Comments/Comments";
const ViewProject = () =>{
    // const location = useLocation();
    // const { state } = location.state;
    const { state } = useLocation();
    let { dispatch} = useContext(AuthContext);
    const [comments,setComments] = useState(null);
    

    useEffect(() =>{
       
        //fetch comments
        state && fetchComments()
        
      },[]);
      
      const fetchComments = async() =>{
        const foundComments = await getComments(state.postId,dispatch);
        if(foundComments.length > 0)  setComments(foundComments)
       
     
      }
      console.log(state)

    return (
        <div>
            <h3>{state.projectName}</h3>
            <p>{state.desc}</p>
            <p>{state.maxMembers - state.members.length  +" "} {state &&  state.maxMembers - state.members.length === 1 ?"Space left":"Spaces left"}</p>
            <p>{format(state.createdAt)} </p>
            <h3>Comments</h3>
            <Comments fetchComments={fetchComments} postId={state.postId} comments={comments} />

        </div>
    )

}

export default ViewProject