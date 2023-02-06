import './CreateProject.css'
import { AuthContext } from '../../context/AuthContext';
import { useContext  } from "react";
import {  createProjectPost } from '../../api/ProjectRequest';
import { useState } from 'react';
import { useLogout } from '../../hooks/useLogout'  

const CreateProject =  ({updateParentPost}) =>{
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [projectName, setProjectName] = useState(null);
    const [desc, setDesc] = useState(null);
    const [maxNumber, setMaxNumber] = useState(null); 

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
        <div>
            <h4>Create project post</h4>
           <form onSubmit={handleSubmit}>
                <input type="text" 
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                placeholder="projectName"
                />
                
                <textarea cols='35' rows='10'
                 onChange={(e) => setDesc(e.target.value)}
                 value={desc}
                ></textarea>
                <input type="text" 
                value={maxNumber}
                onChange={(e) => setMaxNumber(e.target.value)}    
                />
                <button>Create</button>
           </form>
        </div>
    )
}

export default CreateProject