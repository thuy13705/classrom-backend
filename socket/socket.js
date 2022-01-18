const { Server } = require("socket.io");

const io = new Server(3000, { 
    cors: {
        origin: "http://localhost:3000",
      },
});

io.on("connection", (socket) => {

});