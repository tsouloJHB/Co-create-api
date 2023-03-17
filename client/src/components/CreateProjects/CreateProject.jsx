import React from "react";
import './CreateProject.css'
import { AuthContext } from '../../context/AuthContext';
import { useContext  } from "react";
import {  createProjectPost } from '../../api/ProjectRequest';
import { useState } from 'react';
import { useLogout } from '../../hooks/useLogout'  
import {  Button } from "@mui/material";
import AlertDialog from "../DialogBox/DialogBox";



const CreateProject =  ({updateParentPost}) =>{
    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    const [projectName, setProjectName] = useState("");
    const [desc, setDesc] = useState("");
    const [maxNumber, setMaxNumber] = useState(null); 
    const [imageValue,setImageValue] = useState(null)
    const [tags,setTags] = useState(null)
    const [trigger, setTrigger] = useState(0);


     const handleSubmit = async(e) =>{
        e.preventDefault();
        setTrigger((trigger) => trigger + 1);
      
        // const formData = new FormData()
        // formData.append("imageUpload", imageValue)
        // formData.append("projectName", projectName)
        // formData.append("desc", desc)
        // formData.append("maxMembers", maxNumber)
        // const post = await createProjectPost(formData,user,dispatch,logout);
        // if(post){
        //     //reload post
        //     setDesc("");
        //     setProjectName("");
        //     setMaxNumber("");
        //     updateParentPost();
        // }
     }
     const submitCreatePost = (tags) =>{
         const formData = new FormData()
        formData.append("imageUpload", imageValue)
        formData.append("projectName", projectName)
        formData.append("desc", desc)
        formData.append("maxMembers", maxNumber)
        formData.append("tags",tags)
        console.log(formData)
        console.log(tags)
        // const post = await createProjectPost(formData,user,dispatch,logout);
        // if(post){
        //     //reload post
        //     setDesc("");
        //     setProjectName("");
        //     setMaxNumber("");
        //     updateParentPost();
        // }
     }  

     const setImage = async(e) =>{
       
        setImageValue(e.target.files[0])
     
    }

    const updateTags = (obj) => {
        setTags(obj)
        console.log(obj)
    }
    return (
        <div className='write-post-container post-border'>
               <div class="sidebar-title">
                    <p className="yourProject">Create project</p>
                 
                </div>
            <div class="post-input-container-project">
            {/* <form class="form-inline" action="/action_page.php">
            <div class="form-group create-from">
                    <label for="email">Email address:</label>
                    <input type="email" class="form-control" id="email"/>
                </div>
                <div class="form-group">
                    <label for="pwd">Password:</label>
                    <input type="password" class="form-control" id="pwd"/>
                </div>
                <div class="checkbox">
                    <label><input type="checkbox"/> Remember me</label>
                </div>
                <button type="submit" class="btn btn-default">Submit</button>
            </form> */}
            {/* import EmojiPicker from 'emoji-picker-react';

function App() {
  return (
    <div>
      <EmojiPicker />
    </div>
  );
} */}
                <form onSubmit={handleSubmit} class="form-inline create-from">
                  
                        {/* <label>Project name</label> */}
                        <input class="form-control form-input" type="text" placeholder="Project name"
                        onChange={(e) => setProjectName(e.target.value)}
                        value={projectName}
                       
                        />
                   
                        
                        <input type="text" 
                        class="form-control max-input"
                        placeholder="max"
                        value={maxNumber}
                        onChange={(e) => setMaxNumber(e.target.value)}    
                        />
                        
                         
                        <textarea cols='35' rows='3' class="form-control"
                        id="textarea-create"
                        placeholder="Description"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        ></textarea>
                        <div className="formFooter">
                        
                        <button id='submitCreate' type="submit" class="btn btn-primary mb-8">Create</button>
                        <input type="file" className=" form-control projectUpload" onChange={(e) => setImage(e)} />
                        </div>
                        
                       
                </form>
                <AlertDialog updateTags={updateTags}  trigger={trigger} submitCreatePost={submitCreatePost} />
                   {/* <form class="form-inline">
                    <div class="form-group mb-2">
                        <label for="staticEmail2" class="sr-only">Email</label>
                        <input type="text" readonly class="form-control-plaintext" id="staticEmail2" value="email@example.com"/>
                    </div>
                    <div class="form-group mx-sm-3 mb-2">
                        <label for="inputPassword2" class="sr-only">Password</label>
                        <input type="password" class="form-control" id="inputPassword2" placeholder="Password"/>
                    </div>
                    <button type="submit" class="btn btn-primary mb-2">Confirm identity</button>
                    </form> */}
           </div>
        </div>
    )
}

export default CreateProject