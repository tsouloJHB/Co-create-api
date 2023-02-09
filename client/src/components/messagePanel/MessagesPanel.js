
import { useEffect, useState,useRef } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'  
import { useContext } from "react";
import { getUsers ,getUser} from "../../api/GetUsers";
import { getGroupMessages, sendMessage } from "../../api/GroupMessages";
import Lottie from 'react-lottie'
import animationData from "../../animations/typing.json";
import {io} from "socket.io-client";
import {format} from "timeago.js";

const MessagesPanel = ({project}) =>{

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
        console.log(project)
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
        <div>
            <h4>Group Chat</h4>
        
            {groupChat && groupChat.map((chat) => (
                <div key={chat._id}>
                { members.map(member =>(
                    <div key={member._id}>{member._id === chat.senderId ? chat.text + " " + member.name + " "+format(chat.createdAt) : ""}</div>
                ))}
                </div>
            ))}
            {typing && 
            <><Lottie options={defaultOptions} height={20} width={'15%'} /><p>
                {typingData && members && members.map((member,index) =>(
                
                <span>{ member._id === typingData.senderId?member.name + " is typing":""}</span>
                ))}
                </p></>
            }

            {/* {groupChat.map((chat) => (
                <div key={chat._id}>
                
                {members.map((member) => (
                    <div key={member._id}>{subitem.name}</div>
                ))}
                </div>
            ))} */}
            <div>
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
            </div>    
        </div>  
    );

}

export default MessagesPanel