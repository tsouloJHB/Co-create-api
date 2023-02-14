import { useContext, useEffect, useState} from "react";

import { AuthContext } from '../context/AuthContext';
import { getUser } from "../api/GetUsers";
import { useLogout } from '../hooks/useLogout'
import profilePicture from "../images/profile.jpg"
import EditModal from "../components/EditModal/EditModal";

const Profile = () => {
    let { user ,dispatch} = useContext(AuthContext);
    const [profileUser,setProfileUser] = useState(null)
    const {logout} = useLogout();
    const [openModal, setOpenModal] = useState(false);
    const [editField,setEditField] = useState(null)
    const [fieldData,setFieldData] = useState(null)

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

    return (
        <div>
            <h4>Profile</h4>
           
            {profileUser &&<>
                 <p>Name : {profileUser.name + " "}{profileUser.surname}</p>
                 <button onClick={() => handleEdit("name&surname")}>Edit name & surname</button>
                 <p>City : {profileUser.city && profileUser.city}</p>
                 <button onClick={() => handleEdit("city")}>Edit city </button>
                 <p>bio : {profileUser.desc && profileUser.desc}</p>
                 <button onClick={() => handleEdit("desc")}>Edit bio </button>
                 <p>Occupation : {profileUser.occupation && profileUser.occupation}</p>
                 <button onClick={() => handleEdit("occupation")}>Edit occupation </button>
                <br/>
                 {profileUser.image.data && profileUser.image.data.data !== null ? <img alt={profileUser.name} src={`data:image/png;base64,${convertBinaryToString(profileUser.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                 <form>
                    <input type="file" id="myFile" name="filename"/>
                    <input type="submit"/>
                </form>

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
    )
}

export default Profile


