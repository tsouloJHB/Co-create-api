import { useContext, useEffect, useState} from "react";

import { AuthContext } from '../../context/AuthContext';
import { getUser,updateUserProfilePicture } from "../../api/GetUsers";
import { useLogout } from '../../hooks/useLogout'
import profilePicture from "../../images/profile.jpg"
import EditModal from "../../components/EditModal/EditModal";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './Profile.css';

const Profile = () => {
    let { user ,dispatch} = useContext(AuthContext);
    const [profileUser,setProfileUser] = useState(null)
    const {logout} = useLogout();
    const [openModal, setOpenModal] = useState(false);
    const [editField,setEditField] = useState(null)
    const [fieldData,setFieldData] = useState(null)
    const [imageValue,setImageValue] = useState(null)
    const [image,setImage] = useState(null)

    useEffect(()=>{
        getUserData();
    },[]);

    const getUserData = async() =>{
        
        const foundUser = await getUser(user.user,dispatch,logout)
        if(foundUser) setProfileUser(foundUser)
    }


    const convertBinaryToString = (image)=>{
      
        const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.data.data) )
        );
            
        return base64String
    }

    const handleEdit = (field) =>{
        let nameSurname = ""
        profileUser && Object.keys(profileUser).map(key => {
            if(key === field) 
            {
                setFieldData(profileUser[key])    
                return profileUser[key]
            }
            if(field === "name&surname"){
                if(key === "name"|| key === "surname"){
                    nameSurname = nameSurname +"/" +profileUser[key]
                    setFieldData(nameSurname)
                }
            }
            return ""
        }) 
        setEditField(field)
        setOpenModal(true)
    }

    const updateState = (data) => {
        setProfileUser(data)
        console.log(profileUser);
    }

    const handleClick = async(e) =>{
     
        e.preventDefault()
       
        const formData = new FormData()
        formData.append("imageUpload", imageValue)
      
        const profileP = await updateUserProfilePicture(formData,dispatch,logout)   
        if(profileP){
            //get updated profile data 
            getUserData();
        }
    }
    return (
        <div className="middle-cover">
             <h4>Profile</h4>
        <div className="middle-profile">
           
          
            {profileUser &&<>
                <div >
                    {profileUser.image.data && profileUser.image.data.data !== null ? <img alt={profileUser.name} src={`data:image/png;base64,${convertBinaryToString(profileUser.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                    
                    <form onSubmit={(e)=>handleClick(e)} encType="multipart/form-data">
                        <input type="file" id="myFile" onChange={(e) => setImageValue(e.target.files[0])} name="filename"/>
                        <input type="submit"  />
                    </form>
                </div>
                <div className="content-row"> 
                    <div className="content-data">
                    <p>Name : {profileUser.name + " "}{profileUser.surname}</p>
                    <AddCircleIcon className="save-button"   sx={{ cursor: 'pointer'}} onClick={() => handleEdit("name&surname")} color="primary" />
                    {/* <button onClick={() => handleEdit("name&surname")}>+</button> */}
                    </div> 
                    <div className="content-data">
                    <p>City : {profileUser.city && profileUser.city}</p>
                    {/* <button onClick={() => handleEdit("city")}>+ </button> */}
                    <AddCircleIcon className="save-button"   sx={{ cursor: 'pointer' }} onClick={() => handleEdit("city")} color="primary" />
                    </div>
                    <div className="content-data">
                    <p>bio : {profileUser.desc && profileUser.desc}</p>
                    {/* <button onClick={() => handleEdit("desc")}>+ </button> */}
                    <AddCircleIcon className="save-button"  sx={{ cursor: 'pointer' }} onClick={() => handleEdit("desc")} color="primary" />
                    </div>

                    <div className="content-data">
                    <p>Occupation : {profileUser.occupation && profileUser.occupation}</p>
                    <AddCircleIcon className="save-button" sx={{ cursor: 'pointer' }}  onClick={() => handleEdit("occupation")} color="primary" />
                    {/* <button onClick={() => handleEdit("occupation")}>+</button> */}
                    </div>
                    <br/>
                </div>
                { image && <img alt="" src={image}/>}
                <EditModal 
                open={openModal} 
                onClose={() => setOpenModal(false)}
                projectData={profileUser}
                fieldName={editField}
                fieldData={ fieldData  }
                updateState={updateState}
                fieldType="profile"
            />
                 </>

            }
           
        </div>
        </div>
    )
}

export default Profile


