let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pencilcolor=document.querySelectorAll(".pencil-color");
let pencilWidth=document.querySelector(".pencil-width");
let eraserWidth=document.querySelector(".eraser-width");
let download=document.querySelector(".Download");
let undo=document.querySelector(".Undo");
let redo=document.querySelector(".Redo");

let pencolor="red";
let eraserColor="white";
let penwidth=pencilWidth.value;
let eraserwidth=eraserWidth.value;

let UndoRedoTracker=[];  //Data
let track=0;     // Represent Action Like Undo,Redo

let mousedown=false;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = "RED";
tool.lineWidth = "2";

//MouseDown->Start New Path,MouseMove->pathfill(graphics)

canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;
    let data={
        x:e.clientX,
        y:e.clientY
    }
    //Send Data to Server
    socket.emit("beginPath",data);
})
canvas.addEventListener("mousemove",(e)=>{
    if(mousedown){
        let data={
            x:e.clientX,
            y:e.clientY,
           color:eraserFlag?eraserColor:pencolor,
            width:eraserFlag?eraserWidth:penwidth
        }
        socket.emit("drawStroke",data);
    }
})
canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;

    let url=canvas.toDataURL();
    UndoRedoTracker.push(url);
    track=UndoRedoTracker.length-1;
})

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}
pencilcolor.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        let color=colorElem.classList[0];
        pencolor=color;
        tool.strokeStyle=pencolor;
    })
})
pencilWidth.addEventListener("change",(e)=>{
    penwidth=pencilWidth.value;
    tool.lineWidth=penwidth;
})
eraserWidth.addEventListener("change",(e)=>{
    eraserwidth=eraserWidth.value;
    tool.lineWidth=eraserwidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle=eraserColor;
        tool.lineWidth=eraserWidth;
    }else{
        tool.strokeStyle=pencolor;
        tool.lineWidth=penWidth
    }
})

download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();

    let t=document.createElement("a");
    t.href=url;
    t.download="Virtual_board.jpg";
    t.click();
})

undo.addEventListener("click",(e)=>{
    if(track>0){
        track--;
    }
    // Perform Action
    let data={
        trackValue:track,
        UndoRedoTracker
    }
    socket.emit("redoUndo",data);
})

redo.addEventListener("click",(e)=>{
    if(track<UndoRedoTracker.length-1){
        track++;
    }
    // Perform Action
    let data={
        trackValue:track,
        UndoRedoTracker
    }
    socket.emit("redoUndo",data);
})

function undoRedoAction(obj){
    track=obj.trackValue;
    UndoRedoTracker=obj.UndoRedoTracker;

    let url=UndoRedoTracker[track];
    let img=new Image();   //New Image Reference Element
    img.src=url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

socket.on("beginPath",(data)=>{
    // data: Data From Server
    beginPath(data);
})

socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("redoUndo",(data)=>{
    undoRedoAction(data);
})
