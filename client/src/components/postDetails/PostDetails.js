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
import LinesEllipsis from 'react-lines-ellipsis'
import profilePicture from "../../images/profile.jpg"
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const PostDetails = ({postDetailsModalSetTrue,postDetailsModalSetFalse,postDetailsModal,post,updateParentPost,closeParent,openParent}) =>{
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
    const comments = true;
   
    useEffect(()=>{
   
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
          setOpenModal(false)
          postDetailsModalSetFalse()
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
       
        if(response.status === 400){
           
        }
        if(response.status === 401){
            // send refresh token
           // await refreshtoken();
           if(response.status === 401){
            const refreshResponse = await RefreshToken(logout,user,dispatch);
          
            if(refreshResponse){
               user = JSON.parse(localStorage.getItem('user'))
               handleSubmit();
            }
          }

        }
        //updateParentPost();
        if(response.ok){
            updateParentPost();
         
            const newPosts = posts.filter(
                item => item._id !== post._id 
            );
            
           // const fetchedPost = await fetchPosts(user,dispatch,logout);
        
          // to update joins get project and then update      
            const project = await getProjectByPostId(post._id)    
           //update joins
            if(project) {
                joins.push(project)
                
                JoinDispatch({type:'SET_JOINS',payload:joins})   
            }     
           //update posts
            postDispatch({type:'SET_POSTS',payload:newPosts});
       
        }
        const json = await response.json();  
    }

    const handleOpenModal = e =>{
    
        if(postDetailsModal || openModal){
            setOpenModal(false)
            postDetailsModalSetFalse()
            return
        }      

        if(screenWidth > 700){
            setOpenModal(true)
            postDetailsModalSetTrue()
            openParent();
        }else{
            //get project from post
            navigate("/viewProject",{state:project});
        }
     
    }

    const convertBinaryToString = (image)=>{
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }

    const handleOnclickEdit = () =>{
       
        navigate("/projectEdit",{state:project});
    }
     project && console.log()
    
     if(project && project.members.includes(user.user) && project.userId !== user.user ){
        return null
     }
    return(
        <div>
            {/* convertBinaryToString(profile.image)  */}
            <div className="workout-details"  onClick={handleOpenModal} >
                {/* {profile && profile.image.data.data &&  <img alt={profile.name} src={`data:image/png;base64,${convertBinaryToString(profile.image)}`}/> } */}
                {profile && profile.image.data && profile.image.data.data !== null ? <img alt={profile.name} src={`data:image/png;base64,${convertBinaryToString(profile.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                {profile &&  profile._id === user.user ? <p>You</p> :<p>{profile && profile.name} {profile && profile.surname}</p> }
                <h4>{project && project.projectName}</h4> 
                <p>{project &&
                //     <LinesEllipsis
                //     text={project.desc}
                //     maxLine='1'
                //     ellipsis='...'
                //     component='p'
                //     basedOn='words'
                //   />
                  <ResponsiveEllipsis text={project.desc} maxLine={1} />
                }</p>
                <p>{project &&  project.maxMembers - project.members.length  +" "} {project &&  project.maxMembers - project.members.length === 1 ?"Space left":"Spaces left"}</p>
                <p>{format(post.createdAt)} </p>
                <div onClick={(e) => {
          e.stopPropagation();
        }}>
                {post.userId === user.user ?  <span className="material-symbols-outlined"  onClick={handleOnclickEdit} >Edit</span> :  <span className="material-symbols-outlined" onClick={handleSubmit} >Join</span>}
                </div>
                <Modal 
                    open={openModal} 
                    onClose={() => {
                        setOpenModal(false)
                        postDetailsModalSetFalse()
                    }}
                    projectData={post}
                    user={profile}
                    insertComments={comments}
           
                    />
                   
            </div>
       </div> 
    )
}

export default PostDetails;