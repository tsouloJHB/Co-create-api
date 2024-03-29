import React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'
import { RefreshToken } from "../../api/RefreshToken";
import { UserProject } from "../../api/UserProjects";
import ProjectDetails from "../../components/projectDetails/ProjectDetails";
import CreateProject from "../../components/CreateProjects/CreateProject";
import {  Button } from "@mui/material";
import './Project.css'


const Projects = () => {
    const { user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [projects,setProjects] = useState([]);
    const status = ['Pending','Inprogress','NotStarted'];
    const [viewTypeProject,setViewTypeProject] = useState("YourProjects");


    useEffect(()=>{
      
        if(user){
            fetchPosts();
            console.log(projects);
        }
    },[user]);

    const fetchPosts = async () =>{
        const response = await UserProject(user,dispatch,logout);
        if(response){
            const inProgress = response.filter(
                item => item.status === 'InProgress'
            );
            console.log(inProgress)
            setProjects(response)
        }
       
    }
    const handleClickSetProject = (view) =>{
            switch (view){
                case "InProgress":
                    setViewTypeProject("InProgress");
                    break;
                case "NotStarted":
                    setViewTypeProject("NotStarted");
                    break;

                case "Pending":
                    setViewTypeProject("Pending");
                    break;    
                default :
                    setViewTypeProject("YourProjects");
                    break;        
            }
    }
    return ( 
        <div className="container project-root">
              <div className="left-sidebar">
            <div  onClick={(e) => {
          e.stopPropagation();
        }}>
              <div class="sidebar-title">
                    <p className="yourProject">Projects</p>
                    <span className="projectTime">All</span>
                </div>
              <button onClick={()=> handleClickSetProject()} class={viewTypeProject === "YourProjects"?"btn btn-danger button-status":"btn btn-primary button-status"} >Your projects</button><br/>
              {/* <Button onClick={()=> handleClickSetProject()} variant="outlined" color={viewTypeProject === "YourProjects"?"info":"success"}  >Your projects</Button><br/> */}
              <button    className="button-status" onClick={()=> handleClickSetProject("InProgress")}  class={viewTypeProject === "InProgress"?"btn btn-danger  button-status":"btn btn-primary button-status"} >Inprogress</button><br/>
              {/* <Button onClick={()=> handleClickSetProject("InProgress")} variant="outlined" color={viewTypeProject === "InProgress"?"info":"success"}  >Inprogress</Button><br/> */}
              <button onClick={()=> handleClickSetProject("NotStarted")}  class={viewTypeProject === "NotStarted"?"btn btn-danger  button-status":"btn btn-primary button-status"} >Not Started</button><br/>
              {/* <Button onClick={()=> handleClickSetProject("NotStarted")} variant="outlined" color={viewTypeProject === "NotStarted"?"info":"success"}  >Not Started</Button><br/> */}
              <button onClick={()=> handleClickSetProject("Pending")}  class={viewTypeProject === "Pending"?"btn btn-danger  button-status":"btn btn-primary button-status"} >Pending</button><br/>
              {/* <Button onClick={()=> handleClickSetProject("Pending")} variant="outlined" color={viewTypeProject === "Pending"?"info":"success"}  >Pending</Button><br/> */}
            </div>  
          </div> 
           
            
            <div className="main-content project-main">
            
         
            
            {projects.length === 0 
            ?<div className="post-container no-projects"><p><b>No Projects Found</b></p>
                <p>All created projects will appear here</p>
              </div> 
            :""} 
            
        { viewTypeProject === "InProgress" ? projects && projects.filter((pro) => {
            return  pro.status === "InProgress"
            }).map((item,index)  =>(
                     
                <ProjectDetails key={item._id} project={item}/>
        )):""}   
    
        {  viewTypeProject === "Pending" ? projects && projects.filter((pro) => {
                return pro.status === "Pending"
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                      
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        )):""} 

        
        {  viewTypeProject === "NotStarted" ? projects && projects.filter((pro) => {
                return pro.status === "NotStarted"
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                      
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        )) :""}    

        { viewTypeProject === "YourProjects" ? projects && projects.filter((pro) => {
                return pro.userId === user.user
                }).map((item,index) =>(
                    index === 0 ?
                    <div key={item._id}>
                       
                        <ProjectDetails key={item._id} project={item}/>
                    </div> :     
                    <ProjectDetails key={item._id} project={item}/>
        )):""} 
    
        </div>
        <div class="right-sidebar">
        <CreateProject updateParentPost={fetchPosts} callerComponent="project"/> 
           </div> 
    </div> );
}
 
export default Projects;