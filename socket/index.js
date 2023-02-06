const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("User connected")
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously4
   
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // // send message to a specific user
  // socket.on("send-message", (data) => {
  //   const { receiverId } = data;
  //   const user = activeUsers.find((user) => user.userId === receiverId);
  //   console.log("Sending from socket to :", receiverId)
  //   console.log("Data: ", data)
  //   if (user) {
  //     io.to(user.socketId).emit("receive-message", data);
  //   }
  // });

  //send message to multiple users
  socket.on("broadcast message", (data)=>{
    
    const {receiverIds} = data;
    console.log(receiverIds)
    receiverIds.forEach((id) => {
      const user = activeUsers.find((user) => user.userId === id);
      if(user){
        io.to(user.socketId).emit("receive-message",data.data);
      }
    });
    data = null;
  });

  //display typing
  socket.on("typing",(data) =>{
    const {receiverIds} = data;

    receiverIds.forEach((id) => {
      const user = activeUsers.find((user) => user.userId === id);
      if(user){
        io.to(user.socketId).emit("receive-typing",data);
      }
    });

  });

    //display typing
    socket.on("stop-typing",(data) =>{
      const {receiverIds} = data;
  
      receiverIds.forEach((id) => {
        const user = activeUsers.find((user) => user.userId === id);
        if(user){
          io.to(user.socketId).emit("stop-typing",data);
        }
      });
  
    });

  socket.off("new-user-add",()=>{
    console.log("Socket cleaned");
    socket.leave(socket.id);
  });
});
