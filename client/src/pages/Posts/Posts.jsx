import React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import PostDetails from "../../components/postDetails/PostDetails";
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from "../../context/PostContext";
import * as PostsApi from "../../api/PostRequest";
import { useLogout } from '../../hooks/useLogout'
import { RefreshToken } from "../../api/RefreshToken";
import CreateProject from "../../components/CreateProjects/CreateProject";
import SideJoinRequest from "../../components/SideJoinRequest/SideJoinRequest";
import Notifications from "../../components/notifications/Notifications";
import "./Post.css"
import SnackBar from "../../components/snackbar/SnackBar";
import { useNavigate } from 'react-router-dom';

const Projects = () =>{   
    const { user,dispatch } = useContext(AuthContext);
    const [userState ,setUserState] = useState(user);
    const [localPost,setlocalPost] = useState(null);
    const [triggerSnackBar, setTriggerSnackBar] = useState(0);
    const [joins,setJoins] = useState(null);
    const {posts,postDispatch} = useContext(PostContext);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const navigate = useNavigate();
    const {logout} = useLogout();
    var myPostFound = 0
    const [closeParent, setCloseParent] = useState(false);
    const [postDetailsModal ,setPostDetailsModal] = useState(false);
    
  
    const openParent = () =>{
      setCloseParent(false)
      
    }

    const createTrigger = () =>{
      setTriggerSnackBar((triggerSnackBar) => triggerSnackBar + 1);
    }
    const closeParentModal = ()=>{
      setCloseParent(true)
    } 
    useEffect(()=>{

        //check if user is logged in if not refresh the token

        setUserState(user);
        
       
        const fetchPosts = async () =>{
            if(JSON.parse(localStorage.getItem('user')).token === null){
              localStorage.removeItem('user')
              navigate("/login");
            }
              //await userAuthRefreshToken();  
              //await RefreshToken(logout,user,dispatch);
          
            const response = await fetch(' http://localhost:8080/api/posts/all',{
                method:'GET',
                headers:{'Content-Type': 'application/json'}
            })
            const json = await response.json();
            if(response.ok){
          
              
              const lJoins =  await fetchAllJoinRequest()
           
              if(lJoins){
               
                let data = [];
                //check if the user has joined any of the post if so don't display the post
                json && json.forEach(post => {
                let returnObject = post
                if(lJoins.length > 0){
                  
                  lJoins.some((join) => join.postId !== post._id ? "": returnObject = "" ) 
                  //lJoins.some((join) => join.status === "Pending" ? "": returnObject = "")
                }
                if(returnObject !== "") {
                  data.push(post);
                  return returnObject
                }else{
                  return returnObject
                }
              });
            
              if(data){
                console.log(data)
                postDispatch({type:'SET_POSTS',payload:data});
                setlocalPost(data); 
               
              }
              }
            }
            
        }
        const fetchAllJoinRequest = async () =>{
          
          if(JSON.parse(localStorage.getItem('user')) === undefined){
            localStorage.removeItem('user')
            navigate("/login");
          }
          console.log("JOin request failed");
          const response = await fetch('http://localhost:8080/api/join/requests',{
            method:'GET',
            headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`},
        })
        
  
        if(response.ok){
          const json = await response.json();
          setJoins(json);
          return json
        }
       
        if(response.status === 401){
          console.log("I failed");
          // const refreshResponse = await RefreshToken(logout,user,dispatch);
          // console.log("The refresh response is" + refreshResponse);
        }

        }

         if(user){
          fetchPosts()
                     
         }
       
         
    },[dispatch,user]);

    const updateParentPost = async() =>{
        const data = await PostsApi.fetchPosts(user,dispatch,logout);
       console.log(data);

        setlocalPost(data);
        dispatch({type:'SET_POSTS',payload:data});
    }

    const postDetailsModalSetFalse = () =>{
      setPostDetailsModal(false);
      setCloseParent(true)
    }
    const postDetailsModalSetTrue = () =>{
      setPostDetailsModal(true);
    }



    return (
      <div  className="container "  onClick={() => setCloseParent(true)}   >
        
          {/* side post*/}
          <div className="left-sidebar">
         
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              <p className="yourProject">Join requests</p>
              <SideJoinRequest  closeParentModal={closeParentModal}   closeParent={closeParent} openParent={openParent}/>
            </div>  
          </div>    
          {/* center post*/}
          <div className="main-content post-root">
          <CreateProject updateParentPost={updateParentPost} callerComponent="post" />  
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              {posts && posts.map((post) => (
                  <div key={post._id}> <PostDetails key={post._id} updateParentPost={updateParentPost}
                   postDetailsModalSetFalse={postDetailsModalSetFalse} 
                   postDetailsModalSetTrue={postDetailsModalSetTrue}
                    postDetailsModal={postDetailsModal}  
                    post={post}   
                    closeParentModal={closeParentModal}   
                    closeParent={closeParent} 
                    openParent={openParent} 
                    createTrigger={createTrigger}
                    /> </div> 
              ))}
              {posts && posts.length === 0 ? <div className="post-container">No posts available</div>:""}
            </div>
            <SnackBar message="Join request successful" trigger={triggerSnackBar} />
          </div>
          <div class="right-sidebar">
            <Notifications />
                
               
            </div>
            
      </div>
      
    );
    
}

export default Projects