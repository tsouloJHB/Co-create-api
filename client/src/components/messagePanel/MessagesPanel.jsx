import React from "react";
import { useEffect, useState,useRef } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout'  
import { useContext } from "react";
import { getUsers ,getUser} from "../../api/GetUsers";
import { getGroupMessages, sendMessage } from "../../api/GroupMessages";

import animationData from "../../animations/typing.json";
import {io} from "socket.io-client";
import {format} from "timeago.js";
import './MessagePanel.css'

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
        <div  className="">
          
          <section  class="chat">
        <div  className="header-chat">
          <i  className="icon fa fa-user-o" aria-hidden="true"></i>
          <p  className="name">Megan Leib</p>
          <i  className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
        </div>
        <div  className="messages-chat">
          <div  className="message">
            <div  className="photo" >
              <div  className="online"></div>
            </div>
            <p  className="text"> Hi, how are you ? </p>
          </div>
          <div  className="message text-only">
            <p  className="text"> What are you doing tonight ? Want to go take a drink ?</p>
          </div>
          <p  className="time"> 14h58</p>
          <div  className="message text-only">
            <div  className="response">
              <p  className="text"> Hey Megan ! It's been a while </p>
            </div>
          </div>
          <div  className="message text-only">
            <div  className="response">
              <p  className="text"> When can we meet ?</p>
            </div>
          </div>
          <p  className="response-time time"> 15h04</p>

          <div  className="message">
            <div  className="photo" >
              <div  className="online"></div>
            </div>
            <p className="text"> 9 pm at the bar if possible </p>
          </div>
          <p class="time"> 15h09</p>
        </div>
        <div  className="footer-chat">
          <i  className="icon fa fa-smile-o clickable"  aria-hidden="true"></i>
          <input type="text" class="write-message" placeholder="Type your message here"></input>
          <i  className="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
        </div>
      
            <h4>Group Chat</h4>
        
            {groupChat && groupChat.map((chat) => (
                <div className="messages-chat" key={chat._id}>
                { members.map(member =>(
                    <div key={member._id}>
                    <div className="message"  >{member._id === chat.senderId
                       ?  <p className="text"> {chat.text} {member.name}</p> : ""}</div>
                       <p class="time"> {format(chat.createdAt)}</p>
                    </div>   
                ))}
                </div>
            ))}
            {typing && 
            <>Typing<p>
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
</section>
        </div>  
    );

}

export default MessagesPanel