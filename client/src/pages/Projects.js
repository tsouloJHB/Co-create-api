import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout'
import { RefreshToken } from "../api/RefreshToken";
import { UserProject } from "../api/UserProjects";
import ProjectDetails from "../components/projectDetails/ProjectDetails";
import CreateProject from "../components/CreateProjects/CreateProject";


const Projects = () => {
    const { user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [projects,setProjects] = useState([]);
    const status = ['Pending','Inprogress','NotStarted'];


    useEffect(()=>{
      
        if(user){
            fetchPosts();
            console.log(projects);
        }
    },[user]);

    const fetchPosts = async () =>{
        const response = await UserProject(user,dispatch,logout);
        if(response){
            console.log(response);
            const inProgress = response.filter(
                item => item.status === 'InProgress'
            );
            console.log(inProgress)
            setProjects(response)
        }
       
    }
    return ( 
        <div className="container">
              <div className="left-sidebar">
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              <h3>Join requests</h3>
              
            </div>  
          </div> 
           
            
            <div className="main-content">
            
            <h3>Projects </h3>
            {projects.length === 0 ?"No Projects Found" :""}   
            { projects && projects.filter((pro) => {
                return  pro.status === "InProgress"
                }).map((item,index)  =>(
                    index === 0 ?
                    <div key={item._id}>
                        <h5>Inprogress </h5>
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        ))}   
        
        { projects && projects.filter((pro) => {
                return pro.status === "Pending"
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                        <h5>Pending </h5>
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        ))} 

        
        { projects && projects.filter((pro) => {
                return pro.status === "NotStarted"
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                        <h5>Not Started </h5>
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        ))}    

        { projects && projects.filter((pro) => {
                return pro.userId === user.user
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                        <h5>Your projects </h5>
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        ))} 
    
        </div>
        <div class="right-sidebar">
        <CreateProject updateParentPost={fetchPosts}/> 
           </div> 
    </div> );
}
 
export default Projects;