import { useEffect ,useState} from 'react';
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout'
import { getUser } from '../../api/GetUsers';

const Navbar = () => {
   const {logout} = useLogout();
   const {user,dispatch} = useAuthContext();
   const [profileUser,setProfileUser] = useState(null)
   
   useEffect(()=>{
   user && getUserData();
  },[]);
  

    const getUserData = async() =>{
        const foundUser = await getUser(user.user,dispatch,logout)
        if(foundUser) setProfileUser(foundUser)
    }

   const handleClick = () =>{
    logout();
   }
    return (
      <header>
        <div className="container">
          <Link to="/">
            <h1>Co-create</h1>
          </Link>
          <nav>
            {user && (
              <div>
                <span>{ profileUser && profileUser.name}</span>
                <Link to="/profile">Profile</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/projects">Project request</Link>
                <Link to="/posts">Your Project post</Link>
                <button onClick={handleClick} >Log out</button>
              </div>
            )}
            {!user && (
              <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    )
  }
  
  export default Navbar