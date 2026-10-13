import { useRef,useEffect,useCallback} from "react";
export default function DrawingBoard({
    canvasRef,
    tool,
    color,
    size,
    fillShape,
    clearSignal,
    undoSignal,
    redoSignal,
    zoom,
    gridPattern,
    onHistoryChange
}){
    const localCanvasRef=useRef(null);
    const isDrawing =useRef(false);
    const startPos=useRef({x:0,y:0});
    const lastPoint=useRef(null);
    const snapshot=useRef(null);

    //Undo & Redo Stacks (storing Data URLs or ImageDatas)
    const history=useRef([]);
    const redoStack=useRef([]);

    //Base canvas logical size
    const BASE_WIDTH=1600;
    const BASE_HEIGHT=1000;

    //Update parent with undo/redo state
    const notifyHistoryState=useCallback(()=>{
        if (onHistoryChange){
            onHistoryChange({
                canUndo:history.current.length > 0,
                canRedo:redoStack.current.length > 0
            });
        }
},[onHistoryChange]);

// Save current cavas state to history
const saveState=useCallback(()=>{
    const canvas=localCanvasRef.current;
    if (!canvas) return;
    const dataUrl=canvas.toDataURL("image/png");
    history.current.push(dataUrl);
    if (history.current.length>30){
        history.current.shift(); //keep stack capped
    }
    redoStack.current=[];
    notifyHistoryState();
},[notifyHistoryState]);

// Intial Canvas Setup with Retina / High-DPI support 
useEffect(()=>{
    const canvas =localCanvasRef.current;
    if (!canvas) return;
    canvasRef.current=canvas;
    const ctx=canvas.getContext("2d");
    const dpr=window.devicePixelRatio || 1;

    canvas.width=BASE_WIDTH*dpr;
    canvas.height=BASE_HEIGHT*dpr;
    canvas.style.width=`${BASE_WIDTH}px`;
    canvas.style.height=`${BASE_HEIGHT}px`;

    ctx.scale(dpr,dpr);
    ctx.lineCap="round";
    ctx.lineJoin="round";

    // Intial blank canvas save
    saveState();
},[canvasRef,saveState]);

// Undo Handler
useEffect(()=>{
    if (undoSignal===0 || history.current.length <=1) return;

    const canvas=localCanvasRef.current;
    const ctx=canvas.getContext("2d");

    const currentSnapshot=history.current.pop();
    redoStack.current.push(currentSnapshot);

    const previousSnapshot=history.current[history.current.length-1];
    if (previousSnapshot){
        const img =new Image();
        img.src=previousSnapshot;
        img.onload=()=>{
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);
            ctx.restore();
            notifyHistoryState();
        };
    }
},[undoSignal,notifyHistoryState]);

// Redo Handler
useEffect(()=>{
    if (redoSignal===0 || redoStack.current.length===0) return;
 
    const canvas=localCanvasRef.current;
    const ctx=canvas.getContext("2d");

    const nextSnapshot=redoStack.current.pop();
    history.current.push(nextSnapshot);

    const img=new Image();
    img.src=nextSnapshot;
    img.onload=()=>{
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        ctx.restore();
        notifyHistoryState();
    };
},[redoSignal,notifyHistoryState]);

// Clear Signal Handler
useEffect(()=>{
    if (clearSignal===0) return;
    saveState();
    const canvas=localCanvasRef.current;
    const ctx=canvas.getContext("2d");
    
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    notifyHistoryState();
},[clearSignal,saveState,notifyHistoryState]);

 // Calculate coordinates relative to canvas taking scale & scroll into account
 const getCanvasCoords=(e)=>{
    const canvas=localCanvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const scaleX=BASE_WIDTH / rect.width;
    const scaleY=BASE_HEIGHT / rect.height;
    return {
        x: (e.clientX-rect.left) * scaleX,
        y: (e.clientY-rect.top) * scaleY,
    };
 };

// Setup Context for Current Tool
const setupContext=(ctx)=>{
    ctx.strokeStyle=color;
    ctx.fillStyle=color;
    ctx.lineWidth=size;
    ctx.lineCap="round";
    ctx.lineJoin="round";

    if (tool==="eraser") {
        ctx.globalCompositeOperation="destination-out";
        ctx.lineWidth=size*2.5;
    } else if (tool==="highlighter"){
        ctx.globalCompositeOperation="source-over";
        ctx.globalAlpha=0.35;
        ctx.lineWidth=size*3; 
    }else{
        ctx.globalCompositeOperation="source-over";
        ctx.globalAlpha=1.0;
    }
};

// Draw Arrow helper
const drawArrow=(ctx,fromX,fromY,toX,toY)=>{
    const headLength=Math.max(12,size*2.5);
    const angle=Math.atan2(toY-fromY,toX-fromX);

    ctx.beginPath();
    ctx.moveTo(fromX,fromY);
    ctx.lineTo(toX,toY);
    ctx.stroke();

    //Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX,toY);
    ctx.lineTo(
        toX-headLength*Math.cos(angle-Math.PI/6),
        toY-headLength*Math.sin(angle-Math.PI/6)
    );
    ctx.lineTo(
        toX-headLength*Math.cos(angle+Math.PI/6),
        toY-headLength*Math.sin(angle+Math.PI/6)
    );
ctx.closePath();
ctx.fill();
};

// Pointer Down (Mouse /Stylus /Touch)
const handlePointerDown=(e)=>{
    if (tool==="pan") return;
    try{
        e.currentTarget.setPointerCapture(e.pointerId);
    }catch{
        // ignore
    }
    const canvas=localCanvasRef.current;
    const ctx=canvas.getContext("2d");
    const coords=getCanvasCoords(e);

    isDrawing.current=true;
    startPos.current=coords;
    lastPoint.current=coords;

    // Take snapshot of raw canvas for shape Previews
    snapshot.current=ctx.getImageData(0,0,canvas.width,canvas.height);

    setupContext(ctx);

    if (tool ==="pen" || tool === "highlighter" || tool=== "eraser")
    {
        ctx.beginPath();
        ctx.moveTo(coords.x,coords.y);
        ctx.lineTo(coords.x,coords.y);
        ctx.stroke();
    }
};

//  Pointer Move
const handlePointerMove=(e)=>{
    if (!isDrawing.current || tool==="pan") return;

    const canvas=localCanvasRef.current;
    const ctx=canvas.getContext("2d");
    const coords=getCanvasCoords(e);
    if (tool==="pen" || tool ==="highlighter" || tool === "eraser"){
        setupContext(ctx);
    // Quadratic Bezier smoothing
    const midPoint={
    x:(lastPoint.current.x+coords.x)/2,
    y:(lastPoint.current.y+coords.y)/2
};
ctx.beginPath();
ctx.moveTo(lastPoint.current.x,lastPoint.current.y);
ctx.quadraticCurveTo(
    lastPoint.current.x,
    lastPoint.current.y,
    midPoint.x,
    midPoint.y
);
ctx.stroke();
lastPoint.current=coords;
    }
else{
    // Shape Preview : Restore canvas snapshot first
    if (snapshot.current){
        ctx.putImageData(snapshot.current,0,0);
    }
    setupContext(ctx);
    const fromX=startPos.current.x;
    const fromY=startPos.current.y;
    const toX=coords.x;
    const toY=coords.y;

    if (tool==="rectangle"){
        ctx.beginPath();
        const w=toX-fromX;
        const h=toY-fromY;
        ctx.rect(fromX,fromY,w,h);
        if (fillShape) ctx.fill();
        ctx.stroke();
    } else if (tool==="circle"){
        ctx.beginPath();
        const radiusX=Math.abs(toX-fromX) /2;
        const radiusY=Math.abs(toY-fromY) /2;
        const centerX=fromX+(toX-fromX) /2;
        const centerY=fromY+(toY-fromY) /2;
        ctx.ellipse(centerX,centerY,radiusX,radiusY,0,0,2*Math.PI);
        if (fillShape) ctx.fill();
        ctx.stroke();
    } else if (tool==="line"){
        ctx.beginPath();
        ctx.moveTo(fromX,fromY);
        ctx.lineTo(toX,toY);
        ctx.stroke();
    }else if (tool==="arrow"){
        drawArrow(ctx,fromX,fromY,toX,toY);
   }
}
};
// Pointer Up / Leave
const handlePointerUp=(e)=>
{
    if (!isDrawing.current) return;
    isDrawing.current=false;
    try{
        e.currentTarget.releasePointerCapture(e.pointerId);
    } catch{
        //  ignore
    }
    const canvas =localCanvasRef.current;
    const ctx=canvas.getContext("2d");
    setupContext(ctx);
    // Save final canvas state to history
    saveState();
};
return (
    <div
    className={`drawing-container pattern-${gridPattern}`}
    style={{
        transform: `scale(${zoom})`,
        transformOrigin:"center center"
    }}
 >
<canvas
ref={localCanvasRef}
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerCancel={handlePointerUp}
/>
 </div>
);
}