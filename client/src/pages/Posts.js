import { useEffect, useState } from "react";
import { useContext } from "react";
import PostDetails from "../components/postDetails/PostDetails";
import { AuthContext } from '../context/AuthContext';
import { PostContext } from "../context/PostContext";
import * as PostsApi from "../api/PostRequest";
import { useLogout } from '../hooks/useLogout'
import { RefreshToken } from "../api/RefreshToken";
import CreateProject from "../components/CreateProjects/CreateProject";
import SideJoinRequest from "../components/SideJoinRequest/SideJoinRequest";

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
        console.log(userState);
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
              console.log(lJoins)
              if(lJoins){
               
                let data = [];
             
                json && json.forEach(post => {
                let returnObject = post
                if(lJoins){
                  
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
    return (
      <div   onClick={() => setCloseParent(true)}   >
          <CreateProject updateParentPost={updateParentPost}/>  
          {/* side post*/}
          <div className="home">
            <div className="workouts" onClick={(e) => {
          e.stopPropagation();
        }}>
              <p>Join request</p>
              <SideJoinRequest closeParentModal={closeParentModal}   closeParent={closeParent} openParent={openParent}/>
            </div>  
          </div>    
          {/* center post*/}
          <div className="home" >
          
            <div className="workouts" onClick={(e) => {
          e.stopPropagation();
        }}>
            
              {/* {post && post.map((post) => {
                  let returnObject = <PostDetails key={post._id} post={post} />
                  joins && joins.some((join) => join.postId !== post._id ? "": returnObject = "" )
              return  returnObject
              })} */}
              <div>{user.token}</div>
              
              {posts && posts.map((post) => (
                
                 
                  <div key={post._id}> <PostDetails key={post._id} updateParentPost={updateParentPost} postDetailsModalSetFalse={postDetailsModalSetFalse} postDetailsModalSetTrue={postDetailsModalSetTrue} postDetailsModal={postDetailsModal}  post={post}   closeParentModal={closeParentModal}   closeParent={closeParent} openParent={openParent}/> </div>
                
              
                  
              ))}
            </div>
            
          </div>
      </div>
    );
    
}

export default Projects