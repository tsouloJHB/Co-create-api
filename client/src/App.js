
import './App.css';
import { BrowserRouter, Navigate, Route ,Routes} from 'react-router-dom';
import { useEffect } from "react";
//Pages & components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavBar from './components/navbar/NavBar'
import { AuthContext } from './context/AuthContext';
import Posts from './pages/Posts';
import Projects from './pages/Projects';
import { useContext } from "react";
import { RefreshToken } from './api/RefreshToken';
import { useLogout } from './hooks/useLogout';
import ProjectView from './pages/ProjectView';
import ProjectStatus from './pages/ProjectStatus';
import ViewProject from './pages/ViewProject';
import ProjectEdit from './pages/ProjectEdit';


function App () {
  const { user ,dispatch} = useContext(AuthContext);
  const {logout} = useLogout();

  useEffect(()=>{
    const checkUserAuth = async () =>{
      await RefreshToken(logout,user,dispatch);
    }
    if(user){
      checkUserAuth()       
     }
  });

  return (
    <div className="App">
      <BrowserRouter>
      <NavBar/>
        <div className="pages">
          <Routes>
          <Route
           path="/posts"
           element={user ? <Posts/>:  <Login/>}
           />
            <Route
              path="/"
              element={user ? <Home/>: <Navigate to="/login"/>}
           />
            <Route
           path="/projects"
           element={user ? <Projects />:  <Login/>}
           />
           <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/projects" />} 
           />
           <Route
            path="/projectStatus"
            element={user ? <ProjectStatus /> :  <Login/>} 
           />
            <Route
            path="/projectview"
            element={user ? <ProjectView /> :  <Login/>} 
           />

          <Route
            path="/viewProject"
            element={user ? <ViewProject /> :  <Login/>} 
           />

          <Route
            path="/projectEdit"
            element={user ? <ProjectEdit /> :  <Login/>} 
           />
            
            <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/projects" />} 
           />
        
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
