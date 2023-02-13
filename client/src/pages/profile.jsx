import { useContext, useEffect, useState} from "react";

import { AuthContext } from '../context/AuthContext';
import { getUser } from "../api/GetUsers";
import { useLogout } from '../hooks/useLogout'
import profilePicture from "../images/profile.jpg"

const Profile = () => {
    let { user ,dispatch} = useContext(AuthContext);
    const [profileUser,setProfileUser] = useState(null)
    const {logout} = useLogout();

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

    return (
        <div>
            <h4>Profile</h4>
           
            {profileUser &&<>
                 <p>Name : {profileUser.name + " "}{profileUser.surname}</p>
                 <button>Edit name & surname</button>
                 <p>City : {profileUser.city && profileUser.city}</p>
                 <button>Edit city </button>
                 <p>bio : {profileUser.desc && profileUser.desc}</p>
                 <button>Edit bio </button>
                 <p>Occupation : {profileUser.occupation && profileUser.occupation}</p>
                 <button>Edit occupation </button>
                <br/>
                 {profileUser.image.data && profileUser.image.data.data !== null ? <img alt={profileUser.name} src={`data:image/png;base64,${convertBinaryToString(profileUser.image)}`}/> :<img alt="fds" src={profilePicture}/>}
                 <form>
                    <input type="file" id="myFile" name="filename"/>
                    <input type="submit"/>
                </form>

                 </>
            }

        </div>
    )
}

export default Profile


