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
import "./Post.css"

const Projects = () =>{
    const { user,dispatch } = useContext(AuthContext);
    const [userState ,setUserState] = useState(user);
    const [localPost,setlocalPost] = useState(null);
   
    const [joins,setJoins] = useState(null);
    const {posts,postDispatch} = useContext(PostContext);

    const {logout} = useLogout();
    var myPostFound = 0
    const [closeParent, setCloseParent] = useState(false);
    const [postDetailsModal ,setPostDetailsModal] = useState(false);
    
  
    const openParent = () =>{
      setCloseParent(false)
      
    }
    const closeParentModal = ()=>{
      setCloseParent(true)
    } 
    useEffect(()=>{

        //check if user is logged in if not refresh the token

        setUserState(user);
        
       
        const fetchPosts = async () =>{
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
       // console.log(data);
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

    const convertBinaryToString = (image)=>{
      
      const base64String = btoa(
          String.fromCharCode(...new Uint8Array(image.data.data) )
      );
          
      return base64String
  }

    return (
      <div  className="container post-root"  onClick={() => setCloseParent(true)}   >
        
          {/* side post*/}
          <div className="left-sidebar">
         
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              <h3>Join requests</h3>
              <SideJoinRequest  closeParentModal={closeParentModal}   closeParent={closeParent} openParent={openParent}/>
            </div>  
          </div>    
          {/* center post*/}
          <div className="main-content">
          <CreateProject updateParentPost={updateParentPost} />  
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              {posts && posts.map((post) => (
                  <div key={post._id}> <PostDetails key={post._id} updateParentPost={updateParentPost} postDetailsModalSetFalse={postDetailsModalSetFalse} postDetailsModalSetTrue={postDetailsModalSetTrue} postDetailsModal={postDetailsModal}  post={post}   closeParentModal={closeParentModal}   closeParent={closeParent} openParent={openParent}/> </div> 
              ))}
            </div>
            
          </div>
          <div class="right-sidebar">
                <div class="sidebar-title">
                    <h4>Notifications</h4>
                    <a href="#">All</a>
                </div>
                <div class="event">
                    <div class="left-event">
                        <h3>18</h3>
                        <span>March</span>
                    </div>
                    <div class="right-event">
                        <h4>Social Media</h4>
                        <p><i class="fas fa-map-marker-alt"></i> Willson Tech Park</p>
                        <a href="#">More Info</a>
                    </div>
                </div>
                <div class="event">
                    <div class="left-event">
                        <h3>22</h3>
                        <span>June</span>
                    </div>
                    <div class="right-event">
                        <h4>Mobile Marketing</h4>
                        <p><i class="fas fa-map-marker-alt"></i> Willson Tech Park</p>
                        <a href="#">More Info</a>
                    </div>
                </div>
                <div class="sidebar-title">
                    <h4>Advertisement</h4>
                    <a href="#">close</a>
                </div>
               
                <div class="sidebar-title">
                    <h4>Conversation</h4>
                    <a href="#">Hide Chat</a>
                </div>
               
            </div>
      </div>
    );
    
}

export default Projects