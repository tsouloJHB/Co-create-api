import React from "react";
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
import { Avatar, IconButton, Tooltip, Button } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import './PostDetails.css'
import forestPicture  from  '../../images/MVI_9962_Moment(3).jpg'

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
    const [commentsAmount,setCommentAmount] = useState(0);
   
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
        
        
        const base64String = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
            
        return base64String
    }

    const handleOnclickEdit = () =>{
       
        navigate("/projectEdit",{state:project});
    }
     project && console.log()
    
     if(project && project.members.includes(user.user) && project.userId !== user.user ){
        return null
     }


    const commentsCount  = (amount)=>{
            setCommentAmount(amount)
    } 
    return(
        <div>
            {/* convertBinaryToString(profile.image)  */}
            <div className="post-container"  onClick={handleOpenModal} >
                <div className="post-border">
                <div className="post-row">
                    <div className="user-row">
                    <div className="user-profile">
                        {/* {profile && profile.image.data.data &&  <img alt={profile.name} src={`data:image/png;base64,${convertBinaryToString(profile.image)}`}/> } */}
                        {profile && profile.image.data && profile.image.data.data !== null ?
                        <Avatar className="profile-pic" src={`data:image/png;base64,${convertBinaryToString(profile.image)}`} alt="" sx={{
                            width: 48,
                            height: 48,
                            
                        }} />:
                        // <img alt={profile.name} src={`data:image/png;base64,${convertBinaryToString(profile.image)}`}/> :
                        <Avatar src={profilePicture} alt="" sx={{
                            width: 48,
                            height: 48,
                        }} />
                        //  <img alt="fds" src={profilePicture}/>}
                        }
                     
                        <div>
                            {profile &&  profile._id === user.user ? <p>You</p> :<p>{profile && profile.name} {profile && profile.surname}</p> }
                            <span>{format(post.createdAt)} </span>
                        </div>
                        </div>
                    </div>
                </div>
                <h4>{project && project.projectName}</h4> 
                <p className="post-text">{project &&
                //     <LinesEllipsis
                //     text={project.desc}
                //     maxLine='1'
                //     ellipsis='...'
                //     component='p'
                //     basedOn='words'
                //   />
                  <ResponsiveEllipsis text={project.desc} maxLine={1} />
                }</p>
                 {project && project.image !== undefined ?
                    <img alt={project && project.projectName} className="postImage" src={forestPicture}  />
                    :""
                 }
                 
             
                 <div class="post-row">
                    <div onClick={(e) => {
                    e.stopPropagation();
                    }}>
                       {/* <Button variant="outlined" color="success"   onClick={handleSubmit} >Join</Button>  */}
                            {post.userId === user.user ?  <SettingsIcon sx={{
                            zIndex:0,
                            color:"red",
                            cursor:"pointer"    
                        }}   onClick={handleOnclickEdit}/>  :  <button  onClick={handleSubmit} class="btn btn-primary   mb-8">Join</button>}
                     </div>
                    
                    <p  className="post-text"><span id="comments-count">{commentsAmount} comments</span>  <span className="space">{project &&  project.maxMembers - project.members.length  +" "}{project &&  project.maxMembers - project.members.length === 1 ?"space left":"spaces left"}</span></p>
                  
                </div>
                <hr/>
                <p id="view-comments">Comments</p> 
                <div id="postFooter">
               
              
                <button   class="btn btn-info btn-xs science">Science</button>
                <button   class="btn btn-success btn-xs tech">Technology</button>
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
                    fromCom={'postDetails'}
                    commentsCount={commentsCount}
                    />
                   
            </div>
            </div>
       </div> 
    )
}

export default PostDetails;