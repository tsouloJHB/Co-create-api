import { useContext, useEffect } from "react";

import { AuthContext } from '../../context/AuthContext';
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { RefreshToken } from "../../api/RefreshToken";
import { useLogout } from "../../hooks/useLogout";
import { getUser } from "../../api/GetUsers";
import { useState } from "react";
import {format} from "timeago.js";
import {getProjectByPostId} from "../../api/ProjectRequest"
import { PostContext } from "../../context/PostContext";
import { fetchPosts } from "../../api/PostRequest";
import { JoinContext } from "../../context/JoinContext";
import Modal from "../modal/Modal";
import { useNavigate } from 'react-router-dom';


const PostDetails = ({post,updateParentPost,closeParent,openParent}) =>{
    let { user ,dispatch} = useContext(AuthContext);
    let {joins,JoinDispatch} = useContext(JoinContext)
    const {refreshtoken} = useRefreshToken();
    const {logout} = useLogout();
    const [profile, setProfile] = useState(null);
    const [project,setProject] = useState(null);
    const {posts,postDispatch} = useContext(PostContext);
    const [openModal, setOpenModal] = useState(false);
    const [modalProject,setModalProject] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
   
    useEffect(()=>{
        console.log(post);
        const foundUser = async() =>{
            const foundUser = await getUser(post.userId,dispatch,logout);
            setProfile(foundUser)
            const foundProject = await getProjectByPostId(post._id,user,dispatch,logout);
            setProject(foundProject)
            return foundUser
        }
        foundUser();


    },[post]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(() => {
        if (closeParent) {
          console.log(closeParent)
          setOpenModal(false)
        }
      }, [closeParent]);


    const handleSubmit = async() =>{
    
        //send join request 
       
        const response = await fetch(' http://localhost:8080/api/join'  ,{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
               
            },
            body: JSON.stringify({postId:post._id})
    
        })      
        console.log(response)
        if(response.status === 400){
            console.log(response)
        }
        if(response.status === 401){
            // send refresh token
           // await refreshtoken();
           if(response.status === 401){
            const refreshResponse = await RefreshToken(logout,user,dispatch);
            console.log("The join request refresh" + refreshResponse);
            if(refreshResponse){
               user = JSON.parse(localStorage.getItem('user'))
               handleSubmit();
            }
          }

        }
        //updateParentPost();
        if(response.ok){
            updateParentPost();
            console.log("join request made")
            console.log(posts);
            const newPosts = posts.filter(
                item => item._id !== post._id 
            );
            
           // const fetchedPost = await fetchPosts(user,dispatch,logout);
        
          // to update joins get project and then update      
            const project = await getProjectByPostId(post._id)    
           //update joins
            if(project) {
                joins.push(project)
                console.log(joins)
                JoinDispatch({type:'SET_JOINS',payload:joins})   
            }     
           //update posts
            postDispatch({type:'SET_POSTS',payload:newPosts});
            console.log(newPosts)
        }
        const json = await response.json();  
    }

    const handleOpenModal = e =>{
    
        
        
       

        if(screenWidth > 700){
            setOpenModal(true)
            openParent();
        }else{
            navigate("/");
        }
     
    }

    return(
        <div>
             
            <div className="workout-details"  onClick={handleOpenModal} >
                {profile && <p>{profile.name} {profile.surname}</p>}
                <h4>{post.projectName}</h4> 
                <p>{post.desc}</p>
                <p>{project &&  project.maxMembers - project.members.length  +" "} {project &&  project.maxMembers - project.members.length === 1 ?"Space left":"Spaces left"}</p>
                <p>{format(post.createdAt)} </p>
                {post.userId === user.user ?  <span className="material-symbols-outlined"  >Edit</span> :  <span className="material-symbols-outlined" onClick={handleSubmit} >Join</span>}
                <Modal 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    projectData={post}
                    user={profile}
           
                    />
                   
            </div>
       </div> 
    )
}

export default PostDetails;