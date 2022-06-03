const  express=require("express");
const socket=require("socket.io");

const app=express();   // Initialization and Making Server

app.use(express.static("frontend"));


let port=5000;
let server=app.listen(port,()=>{
    console.log(`Listening to Port: ${port}`);
})

let io=socket(server);

io.on("connection",(socket)=>{
    console.log("Socket Connection is Establised");
    // Recived Data
    socket.on("beginPath",(data)=>{
        // data: Data from frontend.
        // Transfer the Data For All all Connected Page.
        io.sockets.emit("beginPath",data); 
    })

    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data); 
    })

    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data); 
    })
})

