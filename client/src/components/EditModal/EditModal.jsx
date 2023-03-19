
import React from "react";
import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';
import { updateProject } from '../../api/ProjectRequest';
import { updateUserProfile } from '../../api/GetUsers';

import './modal.css';


const EditModal = ({ open, onClose, projectData,fieldName,fieldData,updateState,fieldType}) =>{
    let { dispatch} = useContext(AuthContext);
    const [field,setField] = useState(null);
    const [secondField,setSecondField] = useState(null);
    const {logout} = useLogout();
    
    useEffect(()=>{
        setField(fieldData)
        if(fieldName === "name&surname"){
          setField(fieldData.split("/")[1])
          setSecondField(fieldData.split("/")[2])
          console.log(fieldData.split("/")[2])
        }
    
    },[fieldData]);


    const handleClick = async() =>{
        


      if(fieldType === "project"){
        updateLocalProject();
      }else if(fieldType === "profile"){
        if(fieldName === "name&surname"){
           updateProfile(2)
        }else{
          updateProfile(1)
        }
      }
       
        
    }

    const updateLocalProject = async() => {
        //build object
        const jsObj = {}
        jsObj[fieldName] = field;
        //api request update field  
        
        const projectUpdate = await updateProject(jsObj,projectData._id,dispatch,logout);
        if(projectUpdate){
            projectData[fieldName] = field
            updateState(projectData)
            onClose(); 
        }
    }

    const updateProfile = async(fields) => {
      //build object
      const jsObj = {}
      if(fields === 1) jsObj[fieldName] = field;
      if(fields === 2){
        jsObj["name"] = field;
        jsObj["surname"] = secondField;
      }
      //api request update field  
      
     
     const profileUpdate = await updateUserProfile(jsObj,dispatch,logout);
      if(profileUpdate){
          projectData[fieldName] = field
          if(fieldName === "name&surname") {
            projectData["name"] = field
            projectData["surname"] = secondField
          }
          updateState(projectData)
          onClose(); 
      }
  }

    if (!open) return null;

 
  
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer modal'
      >
        
        <div className="modal__header">
        <h5 class="modal-title text-center">{fieldName}</h5>  
       
          
        <div className='closeBtnModal'  onClick={onClose}><span>x</span></div> 
       
        </div>
        <div className='modalRight'>
         
          <div className='content'>
            
            <br/>
            <br/>
            <br/>
            { fieldType === "project"? fieldName !== "status" ? <input type="text" value={field}    onChange={(e) => setField(e.target.value)} />:
             
            <select  name="status" onChange={(e) => setField(e.target.value)}>
                <option value="NotStarted">NotStarted</option>
                <option value="Inprogress">Inprogress</option>
                <option value="Pending">Pending</option>
                
            </select>
            :""}

            {fieldType === "profile"? fieldName !== "name&surname"? <input type="text" value={field} className="input_style"   onChange={(e) => setField(e.target.value)} />
              : <><input type="text" value={field} className="input_style"   onChange={(e) => setField(e.target.value)} />
                <input type="text"  value={secondField} className="input_style"   onChange={(e) => setSecondField(e.target.value)} /></>
            :""}
           
            <br/>
            <button onClick={handleClick} className='editbutton'>Update</button>

          </div>
          
        </div>
      </div>
    </div>
    )
}

export default EditModal;