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
import ViewProject from "../../pages/ViewProject";
import {Navigate, Route, Routes, useNavigate ,Link} from 'react-router-dom';
import {  Button } from "@mui/material";



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
          setOpenModal(false)
        }
      }, [closeParent]);
      
 
    // fetch all join request for current user
    const getProjectRequest = async()=>{
        const joinRequest = await fetchAllJoinRequest(user,dispatch,logout);
        //the joins are are late
        setJoinRequest(joinRequest)
             
        if(joinRequest.length > 0){
                        
            const projectData = await fetchProjectData(joinRequest);
        }
 
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
       console.log(localProjects)     
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
        if(openModal){
            setOpenModal(false)
            return
        }
        const index = e.target.getAttribute("data-values");
        
        setModalProject(joins[index])

        if(screenWidth > 700){
            setOpenModal(true)
            openParent();
        }else{
            navigate("/viewProject",{state:joins[index]});
            // const project = e.target.getAttribute("data-projects");
            // console.log(joins[index])
            //<Link to="/viewProject" state={{ post: joins[index] } }></Link>
        }
     
    }

    return (
        <div >
            {closeParent}
            {joins && joins.length === 0?<p>No joins</p>:""}
            {joinRequests && joins && joins.map((project,index)=>(
                <div key={project._id}   data-values={index}  data-projects={project._id} className="workout-details" onClick={handleOpenModal} >
                     <h4 data-values={index}>   {project.projectName}</h4> 
                     <p data-values={index}   >{project.desc} </p>
                     <div onClick={(e) => {e.stopPropagation();}}>
                     {/* { <span  className="material-symbols-outlined" onClick={()=> handleSubmit(project.postId)} >Cancel</span> } */}
                     <Button onClick={()=> handleSubmit(project.postId)}   variant="outlined" color="success"  >Cancel</Button>
                     </div>
                    <Modal 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    projectData={modalProject}
                    user={""}
                    insertComments={false}

                    />
                 </div>
                 
            ))}
       
             
        </div>
    );
}

export default SideJoinRequest