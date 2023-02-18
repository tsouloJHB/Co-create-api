import './CreateProject.css'
import { AuthContext } from '../../context/AuthContext';
import { useContext  } from "react";
import {  createProjectPost } from '../../api/ProjectRequest';
import { useState } from 'react';
import { useLogout } from '../../hooks/useLogout'  
import {  Button } from "@mui/material";


const CreateProject =  ({updateParentPost}) =>{
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [projectName, setProjectName] = useState("");
    const [desc, setDesc] = useState("");
    const [maxNumber, setMaxNumber] = useState(0); 

     const handleSubmit = async(e) =>{
        e.preventDefault();
        const post = await createProjectPost(projectName,desc,maxNumber,user,dispatch,logout);
        if(post){
            //reload post
            setDesc("");
            setProjectName("");
            setMaxNumber("");
            updateParentPost();
        }
     }  
    return (
        <div className='write-post-container'>
            <h4>Create project post</h4>
            <div class="post-input-container">
                <form onSubmit={handleSubmit}>
                        <label>Project name</label>
                        <input className='input-text' type="text" 
                        onChange={(e) => setProjectName(e.target.value)}
                        value={projectName}
                       
                        />
                        <label>Max members</label>
                        <input type="text" 
                        className='input-text'
                        value={maxNumber}
                        onChange={(e) => setMaxNumber(e.target.value)}    
                        />
                         <label>Description</label>
                        <textarea cols='35' rows='4'
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        ></textarea>
                        
                        {/* <button>Create</button> */}
                        <Button  variant="outlined" color="success"  >Create</Button>
                </form>
           </div>
        </div>
    )
}

export default CreateProject