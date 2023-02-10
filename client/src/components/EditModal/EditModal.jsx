
import { useContext,useState } from 'react';
import { useEffect } from 'react';
import { useLogout } from "../../hooks/useLogout";
import { AuthContext } from '../../context/AuthContext';
import { updateProject } from '../../api/ProjectRequest';

import './modal.css';


const EditModal = ({ open, onClose, projectData,fieldName,fieldData,updateState}) =>{
    let { dispatch} = useContext(AuthContext);
    const [field,setField] = useState(null);
    const {logout} = useLogout();
    
    useEffect(()=>{
        setField(fieldData)
    
    },[fieldData]);


    const handleClick = async() =>{
        
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

    if (!open) return null;

 
  
    return (

         <div onClick={onClose} className="overlay">
          
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        
       
        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <h3>{fieldName}</h3>
            <br/>
            {fieldName !== "status"? <input type="text" value={field} className="input_style"   onChange={(e) => setField(e.target.value)} />:
            
            <select  name="status" onChange={(e) => setField(e.target.value)}>
                <option value="NotStarted">NotStarted</option>
                <option value="Inprogress">Inprogress</option>
                <option value="Pending">Pending</option>
                
            </select>
            }
           
            <br/>
            <button onClick={handleClick} className='editbutton'>Update</button>

          </div>
          
        </div>
      </div>
    </div>
    )
}

export default EditModal;