import React from "react"
import { useEffect ,useState} from "react"
import { useLocation } from "react-router-dom"
import './NavBarChecker.css'
const NavBarChecker = ({children}) =>{
    const location = useLocation();
    const [showNavBar,setShowNavBar] = useState(false);

    useEffect(()=>{
        console.log(location)
        if(location.pathname === '/login' || location.pathname === '/signup' ){
            setShowNavBar(false)
        }else{
            setShowNavBar(true)
        }
    },[location])

    return(
        <div className="NavBarChecker">
       
            {showNavBar && children}
        </div>
    )
}
export default NavBarChecker