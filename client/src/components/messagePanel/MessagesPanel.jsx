import React from "react";
import { useEffect, useState,useRef } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'  
import { useContext } from "react";
import { getUsers ,getUser} from "../../api/GetUsers";
import { getGroupMessages, sendMessage } from "../../api/GroupMessages";
import profilePicture from "../../images/profile.jpg"
import animationData from "../../animations/typing.json";
import {io} from "socket.io-client";
import {format} from "timeago.js";
import { Avatar } from "@mui/material";
import { convertBinaryToString} from "../../utils/ImageFormating"
import SendIcon from '@mui/icons-material/Send';
import './MessagePanel.css'

const MessagesPanel = ({project, updateOnlineUsers}) =>{

    const {  user ,dispatch} = useContext(AuthContext);
    const {logout} = useLogout();
    // const location = useLocation();
    // const { project } = location.state;
    const [members,setMembers] = useState(null);
    const [groupChat,setGroupChat] = useState(null);
    const [message,setMessage] = useState(null);
    const [newMessage, setNewMessage] = useState(null)
    const [typing,setTyping] = useState(false);
    const [localTyping,setLocalTyping] = useState(false);
    const [typingData,setDataTyping] = useState(false);
    const [onlineUsers,setOnlineUsers] = useState(null);
    const socket = useRef();


    //lottie animation data
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    useEffect(()=>{
    
        try {
           socket.current = io('ws://localhost:8800');
   
       } catch (error) {
         if (error.response.data) {
           console.log(error)
         }
         console.log(error)
       }
       },[])

       useEffect(()=>{
        newMessage && setGroupChat((prev) =>[...prev,newMessage])
      },[newMessage]);
     
      useEffect(()=>{
   
        socket.current.emit("new-user-add", user.user);
        socket.current.on("get-users", (users) => {
          setOnlineUsers(users)
          updateOnlineUsers(users)
          console.log(users);
        });
        socket.current.on("receive-message",(data) => {
          console.log(data);
          // setGroupChat(data)
          setNewMessage(data);
          console.log("new message");
          
        });
        socket.current.on("receive-typing",(data)=>{
          setTyping(true)
          console.log("set typing is "+ typing);
          console.log("User typing" ,data.senderId)
        });
        socket.current.on("stop-typing",(data)=>{
          setTyping(false)
          setDataTyping(data)
          console.log("User stopped typing" ,data.senderId)
        });
        
      },[socket,user])
      
      
      
    useEffect(()=>{
        //get all project members profiles/ distinguse the leader*
        //get project description or details*
        //get group messages
        
        const getData = async() =>{
           const response = await getUsers(project.members,dispatch,logout);
            setMembers(response)
           //get messages
           const messagesResponse = await getGroupMessages(project._id);
           console.log(messagesResponse);
           setGroupChat(messagesResponse);
           console.log(project.members);

        }

            // const usersList = [];

       getData();
        
    },[]);


    const handleOnchange = async(e)=>{
        setMessage(e.target.value)
       
        const memberIds = project.members.filter((member) => member !== user.user);
        const data = {
          receiverIds:memberIds,
          senderId:user.user,
          name:"james"
        }
       if(!typing){
        setLocalTyping(true);
        socket.current.emit("typing", data);
       }
       let lastTypingTime = new Date().getTime();
       var timerLength = 3000;
       setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && localTyping) {
          socket.current.emit("stop-typing",data);
          setLocalTyping(false);
        }
      }, timerLength);
        
      }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        
      
        const sendMessageResponse = await sendMessage(message,project._id,user,dispatch,logout);
        if(sendMessageResponse){
          
          //send message via socket io
          const memberIds = project.members.filter((member) => member !== user.user);
        
          const data = {
            receiverIds:memberIds,
            message,
            senderId:user.user,
            data:sendMessageResponse
          }
          socket.current.emit("broadcast message", data);
          // update  messages state
          const messagesResponse = await getGroupMessages(project._id);
          setGroupChat(messagesResponse)
          setMessage("");
          
        }
   }

    return (
        <div  className="">
          
          <section  class="chat">
        <div  className="header-chat">
          <i  className="icon fa fa-user-o" aria-hidden="true"></i>
          <p  className="name">{project.projectName}</p> 
          {typing && 
            <><span className="typing">Typing</span><p>
                {typingData && members && members.map((member,index) =>(
                
                <span className="typing">{ member._id === typingData.senderId?member.name + " is typing":""}</span>
                ))}
                </p></>
            }
          <i  className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
        </div>
     
        <div  >
        <form className="footer-chat" onSubmit={handleSubmit}>
          <i  className="icon fa fa-smile-o clickable"  aria-hidden="true"></i>
          <input type="text" className="write-message"  onChange={handleOnchange} placeholder="Type your message here"></input>
          <SendIcon className="sendMessage" color="primary"sx={{ fontSize: "35px",  cursor: 'pointer' }} />
     
          </form>
        </div>
      
      
            <div className="messages-chat messages__content">
            {groupChat && groupChat.map((chat) => (
                <div  key={chat._id}>
                { members.map(member =>(

                  
                    <div key={member._id}>
                      { member._id === user.user ?
                      <>
                         <div className="message"  >{member._id === chat.senderId && user.user === chat.senderId
                          ?  <>
                          { member.image !== undefined &&  member.image.data !== undefined ?
                            <Avatar className="photo" src={`data:image/png;base64,${convertBinaryToString(member.image)}`} alt="" sx={{
                                width: 48,
                                height: 48,
                                
                            }} />:
                        
                            <Avatar src={profilePicture} alt="" sx={{
                                width: 48,
                                height: 48,
                            }} />
                         }
                          <p className="text"> {chat.text} {member.name}</p>  </>: ""}</div>
                          { member._id === chat.senderId ?<p class="time"> {format(chat.createdAt)}</p>:""}</>
                       :<><div  className="message ">
                          <div  className="response">
                            <>
                        
                            <p  className="text"> <span>{member.name}</span>
                            {chat.text} </p>
                            <p class="time-response"> {format(chat.createdAt)}</p>
                            { member.image !== undefined && member.image.data !== undefined ?
                            <Avatar className="profile-pic-message" src={`data:image/png;base64,${convertBinaryToString(member.image)}`} alt="" sx={{
                                width: 48,
                                height: 48,
                                
                            }} />:
                        
                            <Avatar className="profile-pic-message" src={profilePicture} alt="" sx={{
                                width: 48,
                                height: 48,
                            }} />
                         }
                            </>
                          </div>
                       </div>
                       {/* { member._id !== chat.senderId ?<p class="time-response"> {format(chat.createdAt)}</p>:""} */}</>
                       }
                   
                       
                    </div>   
                ))}
                </div>
              
            ))}
             </div> 
            {/* {typing && 
            <>Typing<p>
                {typingData && members && members.map((member,index) =>(
                
                <span>{ member._id === typingData.senderId?member.name + " is typing":""}</span>
                ))}
                </p></>
            } */}

            {/* {groupChat.map((chat) => (
                <div key={chat._id}>
                
                {members.map((member) => (
                    <div key={member._id}>{subitem.name}</div>
                ))}
                </div>
            ))} */}
            
            {/* <div>
                <p>Send message</p>
                <form className="signup" onSubmit={handleSubmit}>
                    <h3>send message</h3>
                
                    <label>message:</label>
                    <input 
                        type="text"
                        onChange={handleOnchange}
                        value={message} 
                    />
                    <button >Send message</button>
            
                </form>
            </div>     */}
</section>
        </div>  
    );

}

export default MessagesPanel