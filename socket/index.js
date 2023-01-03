
const { Socket } = require("socket.io");

const io = require("socket.io")(8800,{
    cors:{
        origin: "http://localhost:3000",
    },
});

let activeUsers = [];

io.on("connection",(socket) =>{
    //add new user
    socket.on("new-user-add", (newUserId)=> {
        //if uer is not added previously
        if(!activeUsers.some((userId) => userId ===  newUserId)){
            activeUsers.push({userId:newUserId,socketId:socket.id});
            console.log("New User connected",activeUsers);
        }
        //send all active users to new user
        io.emit("get-users",activeUsers);
    });

    socket.on("disconnect", () => {
        //remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected",activeUsers);
        // send all active users al all users
        toString.emit("get-users",activeUsers);
    });

    socket.on("send-message", (data) => {
        const {receiverId} = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log("Sending from socket to :", receiverId);
        console.log("Data :" ,data);

        if(user){
            io.to(user.socketId).emit("receive-message",data);
        }
    });

     //send message to multiple users
    socket.on("broadcast message", (data)=>{
        const {receiverIds} = data;
        receiverIds.forEach((id) => {
        const user = activeUsers.find((user) => user.userId === id);
        if(user){
            io.to(user.socketId).emit("receive-message",data);
        }
        });
    });

    
});