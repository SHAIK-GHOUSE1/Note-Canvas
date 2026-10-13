import { useState,useRef,useEffect} from "react";
import DrawingBoard from "./DrawingBoard";
import { PenTool,Highlighter,Eraser,Square,Circle,Minus,ArrowUpRight,Hand,Undo2,Redo2,Trash2,ZoomIn,ZoomOut,
    Grid,AlertTriangle,Maximize2,PaintBucket
 } from "lucide-react";
const PALETTE_COLORS=[
    {id:"#0f172a", label:"Charcoal"},
    {id:"#6366f1" ,label:"Indigo"},
    {id:"#3b82f6" ,label: "Blue"},
    {id:"#10b981" ,label:"Emerald"},
    {id:"#f59e0b" ,label:"Amber"},
    {id:"#ef4444" ,label:"Ruby"},
    {id:"#8b5cf6" ,label:"Purple"},
    {id:"#ec4899" ,label:"Pink"}
];

const STROKE_SIZES=[
    {size:2,label:"Fine (2px)",dot: 4},
    {size:4,label:"Normal (4px)",dot: 7},
    {size:8,label:"Bold (8px)",dot: 11},
    {size:14,label:"Marker (14px)",dot: 16}
];

export default function Workspace({
    canvasRef,showToast
}){
    const [tool,setTool]=useState("pen");
    const [color,setColor]=useState("#6366f1")
    const [size,setSize]=useState(4);
    const [fillShape,setFillShape]=useState(false);

    //Canvas Signals
    const [clearSignal,setClearSignal]=useState(0);
    const [undoSignal, setUndoSignal]=useState(0);
    const [redoSignal, setRedoSignal]=useState(0);

    // Undo/Redo availability state
    const [historyState, setHistoryState]=useState({canUndo: false,canRedo: false});
    //Zoom & Grid State
    const [zoom,setZoom]=useState(1);
    const [gridPattern,setGridPattern]=useState("dots"); // dots, grid, ruled, blank
    //Dropdown states
    const [paletteOpen,setPaletteOpen]=useState(false);
    const [confirmClearOpen,setConfirmClearOpen]=useState(false);
    const paletteRef=useRef(null);
    const canvasAreaRef=useRef(null);
    // Close Palette on click outside
    useEffect(()=>{
        function handleClickOutside(e){
            if (paletteRef.current && !paletteRef.current.contains(e.target)){
                setPaletteOpen(false);
            }
        }
        document.addEventListener("mousedown",handleClickOutside);
        return ()=> document.removeEventListener("mousedown",handleClickOutside);
    },[]);
    // Keyboard Shortcuts for Workspace
    useEffect(()=>{
        function handleKeyDown(e){
            if (e.target.tagName==="INPUT" || e.target.tagName==="TEXTAREA") return;
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="z"){
                e.preventDefault();
            if (e.shiftKey){
                setRedoSignal((prev)=> prev+1);
            }else{
                setUndoSignal((prev)=> prev+1);
            }
            }else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="y"){
                e.preventDefault();
                setRedoSignal((prev)=>prev+1);
            } else if (e.key.toLowerCase()==="p"){
                setTool("pen");
            } else if (e.key.toLowerCase()==="h"){
                setTool("highlighter");
            } else if (e.key.toLowerCase()==="e"){
                setTool("eraser");
            } else if (e.key.toLowerCase()==="r"){
                setTool("rectangle");
            } else if (e.key.toLowerCase()==="c"){
                setTool("circle");
            } else if (e.key.toLowerCase()==="l"){
                setTool("line");
            } else if (e.key.toLowerCase()==="a"){
                setTool("arrow");
            }        
    }
window.addEventListener("keydown",handleKeyDown);
return ()=> window.removeEventListener("keydown", handleKeyDown);
}, []);

//Pan Hand Drag
const isPanning=useRef(false);
const panStart=useRef({x:0,y:0,scrollLeft:0,scrollTop:0});

const handlePanMouseDown=(e)=>{
    if (tool !=="pan") return;
    isPanning.current=true;
    const container=canvasAreaRef.current;
    panStart.current={
        x:e.clientX,
        y:e.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop:container.scrollTop
    };
};
const handlePanMouseMove=(e)=>
{
    if (!isPanning.current || tool !=="pan") return;
    const container =canvasAreaRef.current;
    const dx=e.clientX-panStart.current.x;
    const dy=e.clientY-panStart.current.y;
    container.scrollLeft=panStart.current.scrollLeft-dx;
    container.scrollTop=panStart.current.scrollTop-dy;
};

const handlePanMouseUP=()=>{
    isPanning.current=false;
};

//Zoom handlers

const handleZoomIN=()=>{
    setZoom((prev)=>Math.min(2.0,+(prev+0.15).toFixed(2)));
};
const handleZoomOut=()=>
{
    setZoom((prev)=>Math.max(0.4,+(prev-0.15).toFixed(2)));

};
const handleResetZoom=()=>{
    setZoom(1);
};
const handleFitScreen=()=>{
    if (!canvasAreaRef.current) return;
    const { clientWidth, clientHeight}=canvasAreaRef.current;
    const fitScale=Math.min((clientWidth-80)/1600,(clientHeight-80)/1000);
    setZoom(+(Math.max(0.4,Math.min(1.2,fitScale))).toFixed(2));
};
const handleConfirmClear=()=>{
    setClearSignal((prev)=>prev+1);
    setConfirmClearOpen(false);
    showToast("Canvas cleared","info");
};
return (
    <div className="workspace">
        {/* Floating Studio Toolbar */}
    <div className="floating-toolbar" role="toolbar" aria-label="Drawing Tools">
        {/* Drawing & Brush Tools */}
    <div className="toolbar-group">
    <button
    className={`tool-btn ${tool==="pan" ? "active" : ""}`}
    onClick={()=>setTool("pan")}
    data-tooltip="Pan / Hand"
    aria-label="Pan Tool"
    >
    <Hand size={18} />
    </button>
    <button
    className={`tool-btn ${tool ==="pen" ? "active" : ""}`}
    onClick={()=>setTool("pen")}
    data-tooltip="Pen (P)"
    aria-label="Pen Tool"
    >
    <PenTool size={18} />
    </button>
    <button
    className={`tool-btn ${tool==="highlighter" ? "active": ""}`}
    onClick={()=>setTool("highlighter")}
    data-tooltip="Highlighter (H)"
    aria-label="Highlighter Tool"
>
    <Highlighter size={18} />
</button>
<button
className={`tool-btn ${tool ==="eraser" ? "active" : ""}`}
onClick={()=>setTool("eraser")}
data-tooltip="Eraser (E)"
aria-label="Eraser Tool"
>
<Eraser size={18}/>
</button>
</div>
<div className="toolbar-divider"/>
{/* Shapes Group */}
<div className="toolbar-group">
    <button
    className={`tool-btn ${tool ==="rectangle" ? "active" : ""}`}
    onClick={()=>setTool("rectangle")}
    data-tooltip="Rectangle (R)"
    aria-label="Rectangle Tool"
    >
    <Square size={17}/>
    </button>
<button
className={`tool-btn ${tool==="circle" ? "active" : ""}`}
onClick={()=>setTool("circle")}
data-tooltip="Circle (C)"
aria-label="Circle Tool"
>
<Circle size={17}/>
</button>
<button
className={`tool-btn ${tool ==="line" ? "active" : ""}`}
onClick={()=>setTool("line")}
data-tooltip="Line (L)"
aria-label="Line Tool"
>
<Minus size={18}/>
</button>
<button
className={`tool-btn ${tool ==="arrow" ? "active" : ""}`}
onClick={()=>setTool("arrow")}
data-tooltip="Arrow (A)"
aria-label="Arrow Tool"
>
<ArrowUpRight size={18} />
</button>
<button
className={`tool-btn ${fillShape  ? "active" : ""}`}
onClick={()=>setFillShape((prev)=>!prev)}
data-tooltip={fillShape ? "Fill: ON" :"Fill: OFF"}
aria-label="Toggle Shape Fill"
>
<PaintBucket size={16} />
</button>   
</div>
<div className="toolbar-divider"/>
{/* Color Palette Popover */}
<div className="color-picker-wrapper" ref={paletteRef}>
<button
className="color-preview-btn"
style={{backgroundColor:color}}
onClick={()=>setPaletteOpen((prev)=>!prev)}
data-tooltip="Color Palette"
aria-label="Color Palette"
/>

{
    paletteOpen && (
        <div className="palette-dropdown">
            <span style={{fontSize:"11px",fontWeight:600,color:"var(--text-muted)"}}>
PALETTE
</span>
<div className="palette-swatches">
    {PALETTE_COLORS.map((col)=>(
    <button
key={col.id}
className={`swatch-btn ${color===col.id ? "selected" : ""}`}
style={{background:col.id}}
onClick={()=>{
    setColor(col.id);
    setPaletteOpen(false);
}}
title={col.label}
/>
))}
</div>

<div className="custom-color-row">
    <span>Custom:</span>
<input type="color" className="custom-color-input"
value={color}
onChange={(e)=>setColor(e.target.value)}
title="Pick any color"/>
</div>
</div>
)}
</div>
{/* Stoke Size Selectoe */}
<div className="stroke-size-selector">
    {STROKE_SIZES.map((item)=>(
        <button
    key={item.size}
    className={`size-dot-btn ${size===item.size ? "active" : ""}`}
    onClick={()=>setSize(item.size)}
    title={item.label}
>
<div
style={{
    width:`${item.dot}px`,
    height:`${item.dot}px`,
    borderRadius:"50%",
    backgroundColor: "currentColor"
}}
/>
</button>
))}
</div>
</div>
<div className="toolbar-divider">
    {/* Undo / Redo / Clear */}
    <div className="toolbar-group">
        <button
    className="tool-btn"
    onClick={()=>setUndoSignal((prev)=>prev+1)}
    disabled={!historyState.canUndo}
    data-tooltip="Undo (Ctrl+Z)"
    aria-label="Undo"
>
<Undo2 size={17} />
</button>
<button
    className="tool-btn"
    onClick={()=>setRedoSignal((prev)=>prev+1)}
    disabled={!historyState.canRedo}
    data-tooltip="Redo (Ctrl+Y)"
    aria-label="Redo"
>
<Redo2 size={17} />
</button>
<button
    className="tool-btn"
    onClick={()=>setConfirmClearOpen(true)}
    disabled={!historyState.canUndo}
    data-tooltip="Clear Canvas"
    aria-label="Clear Canvas"
>
<Trash2 size={17} />
</button>
</div>
</div>

{/* Bottom HUD Left : Grid Pattern & Dimesion */}
<div className="canvas-hud-bottom">
<div className="hud-panel">
<Grid size={14} style={{opacity: 0.7}} />
<select
className="hud-select"
value={gridPattern}
onChange={(e)=>setGridPattern(e.target.value)}
title="Canvas Grid Style"
>
<option value="dots">Dots Grid</option>
<option value="grid">Square Grid</option>
<option value="ruled">Ruled Paper</option>
<option value="blank">Blank Surface</option>
</select>
</div>
<div className="hud-panel" style={{fontSize:"11px", opacity:0.8}}>
    <span>1600 x 1000</span>
</div>
</div>
{/* Buttom HUD Right: Zoom Controls */}
<div className="canvas-hud-right">
    <div className="hud-panel">
<button className="hud-btn" onClick={handleZoomOut} title="Zoom Out (-)">
    <ZoomOut size={14} />
</button>
<button
className="hud-btn"
style={{width:"auto",padding:"0 6px",fontSize:"11px"}}
onClick={handleResetZoom}
title="Reset Zoom (100%)"
>
{Math.round(zoom*100)}%
</button>

<button className="hud-btn" onClick={handleZoomIN} title="Zoom In (+)">
    <ZoomIn size={14}/>
</button>

<div style={{width: "1px",height: "14px", backgroundColor: "var(--border-subtle)",margin:"0 2px"}} />
<button className="hud-btn" onClick={handleFitScreen} title="Fit to Screen">
    <Maximize2 size={14} />
</button>
</div>
</div>
{/* Canvas Area Viewport */}
<div
ref={canvasAreaRef}
className={`canvas-area ${tool==="pan" ? "tool-pan" : ""}`}
onMouseDown={handlePanMouseDown}
onMouseMove={handlePanMouseMove}
onMouseUp={handlePanMouseUP}
onMouseLeave={handlePanMouseUP}
>
<DrawingBoard
canvasRef={canvasRef}
tool={tool}
color={color}
size={size}
fillShape={fillShape}
clearSignal={clearSignal}
undoSignal={undoSignal}
redoSignal={redoSignal}
zoom={zoom}
gridPattern={gridPattern}
onHistoryChange={setHistoryState}
/>
</div>
{/* Clear Canvas Confirmation Modal */}
{confirmClearOpen && (
    <div className="modal-overlay" onClick={()=>setConfirmClearOpen(false)}>
    <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
    <div className="modal-header">
    <div style={{display:"flex",alignItems:"center",gap: "8px"}}>
    <AlertTriangle size={20} color="var(--accent-warning)"/>
    <h3 className="modal-title">Clear Canvas?</h3>
    </div>
    </div>
<div className="modal-body">
<p style={{fontSize:"14px",color:"var(--text-secondary)",lineHeight:1.5}}>
    Are you sure you want to clear the entire drawn board? You will still be able to undo this action immediately after.</p>
</div>
<div className="modal-footer">
<button
className="btn-secondary"
onClick={()=>setConfirmClearOpen(false)}
>
    Cancel
</button>
<button
className="btn-primary"
style={{backgroundColor: "var(--accent-danger)"}}
onClick={handleConfirmClear}
>
Clear Canvas
</button>
</div>
</div>
</div>
)}
</div>
);
}