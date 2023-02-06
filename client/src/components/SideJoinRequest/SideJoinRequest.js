import {useContext, useEffect,useState } from "react";
import { fetchAllJoinRequest } from "../../api/PostRequest";
import { getProjectByPostId } from "../../api/ProjectRequest";
import { RefreshToken } from "../../api/RefreshToken";
import { useLogout } from "../../hooks/useLogout";
import { getUser } from "../../api/GetUsers";
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from "../../context/PostContext";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { cancelJoinRequest } from "../../api/JoinRequest";
import { fetchPosts } from "../../api/PostRequest";
import { JoinContext } from "../../context/JoinContext";
import Modal from "../modal/Modal";
import ViewProject from "../viewProject/ViewProject";
import {Navigate, Route, Routes, useNavigate } from 'react-router-dom';



const SideJoinRequest = ({closeParentModal,closeParent,openParent}) =>{
    let {joins,JoinDispatch} = useContext(JoinContext)
    const [joinRequests, setJoinRequest] = useState(null);
    let { user ,dispatch} = useContext(AuthContext);
    let {posts,postDispatch} = useContext(PostContext)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
    const {refreshtoken} = useRefreshToken();
    const {logout} = useLogout();
    const [projects ,setProjects] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const [modalProject,setModalProject] = useState(null);



    useEffect(()=>{
     
        getProjectRequest();

        
    },[]);

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
      
 
    // fetch all join request for current user
    const getProjectRequest = async()=>{
        const joinRequest = await fetchAllJoinRequest(user,dispatch,logout);
        //the joins are are late
        console.log(joinRequests);
        setJoinRequest(joinRequest)        
        if(joinRequest){
        // console.log(joinRequest)
            const projectData = await fetchProjectData(joinRequest);
        }
        console.log(joins);
        return joinRequest
        
    }

    //get the project data from project request using the postId
    const fetchProjectData = async(joinRequest)=>{
        const localProjects = []
      
        //get all projects from join request
        const joinRequests = await Promise.all(
            joinRequest && joinRequest.map(async (join) => {
                const project = await getProjectByPostId(join.postId,user,dispatch,logout);
            if(project !== null) {
                localProjects.push(project);
                return project;
            }  
            })
        );
       //set projects to state
           
        JoinDispatch({type:'SET_JOINS',payload:localProjects})
        setProjects(localProjects)

    }

    const handleSubmit = async(postId) =>{
        //send cancel join request
        
        const cancelResponse = await cancelJoinRequest(postId,user,dispatch,logout);
        if(cancelResponse){
            const inProgress = projects.filter(
                item => item.postId !== postId
            );
            JoinDispatch({type:'SET_JOINS',payload:inProgress})
            setProjects(inProgress);
            // update the post component state    
            const fetchedPost = await fetchPosts(user,dispatch,logout);
            postDispatch({type:'SET_POSTS',payload:fetchedPost})
        }
    }
    
    const handleOpenModal = e =>{
    
        const index = e.target.getAttribute("data-values");
        
        setModalProject(joins[index])

        if(screenWidth > 700){
            setOpenModal(true)
            openParent();
        }else{
            navigate("/");
        }
     
    }

    return (
        <div >
            {closeParent}
            
            {joinRequests && joins && joins.map((project,index)=>(
                <div key={project._id} data-values={index} className="workout-details" onClick={handleOpenModal} >
                     <h4 data-values={index}>   {project.projectName}</h4> 
                     <p data-values={index}   >{project.desc} </p>
                     <div onClick={(e) => {e.stopPropagation();}}>
                     { <span  className="material-symbols-outlined" onClick={()=> handleSubmit(project.postId)} >Cancel</span> }
                     </div>
                    <Modal 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    projectData={modalProject}
                    user={""}
                    />
                 </div>
                 
            ))}
       
             
        </div>
    );
}

export default SideJoinRequest