import { useState,useEffect,useRef } from "react";
import {jsPDF} from "jspdf";
import Header from "./components/Header";
import Workspace from "./components/Workspace";
import Toast from "./components/Toast";
import "./App.css"

export default function App(){
  //Theme State
  const [theme,setTheme]=useState(()=>{
    return localStorage.getItem("notecanvas-theme") || "light";

  });
  // Canvas Reference
  const canvasRef=useRef(null);

  //Sync Theme with document root
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",theme);
    localStorage.setItem("notecanvas-theme",theme);
  },[theme]);
  const toggleTheme=()=>{
    setTheme((prev) => (prev==="dark" ? "light" : "dark"));
  };

  // Toast Notification System
  const [toasts,setToasts]=useState([]);
  const showToast=(message,type="info")=>{
    const id=Date.now()+Math.random();
    setToasts((prev) => [...prev,{id,message,type}]);
    setTimeout(()=>{
      setToasts((prev)=>prev.filter((t)=>t.id!==id));
    },3200);
  };

  // Export Canvas as PNG
  const handleExportPNG=()=>{
    const canvas =canvasRef.current;
    if (!canvas) return ;

    // Create a temporary canvas with matching background so exports are clean
    const tempCanvas =document.createElement("canvas")
    tempCanvas.width=canvas.width;
    tempCanvas.height=canvas.height;
    const tempCtx=tempCanvas.getContext("2d");

    // Fill background
    tempCtx.fillStyle=theme==="dark" ? "#0f172a" : "#ffffff";
    tempCtx.fillRect(0,0,tempCanvas.width,tempCanvas.height);
    // Draw current canvas on top 
    tempCtx.drawImage(canvas,0,0);
    const image=tempCanvas.toDataURL("image/png");
    const link=document.createElement("a");
    link.href=image;
    link.download=`notecanvas-${Date.now()}.png`;
    link.click();
    showToast("Canvas exported as high-res PNG!","success");
  };

  // Export Canvas as PDF
  const handleExportPDf= ()=>{
    const canvas=canvasRef.current;
    if (!canvas) return;

  // Render with background for PDF
  const tempCanvas=document.createElement("canvas");
  tempCanvas.width=canvas.width;
  tempCanvas.height=canvas.height;
  const tempCtx=tempCanvas.getContext("2d");
  tempCtx.fillStyle="#ffffff";
  tempCtx.fillRect(0,0,tempCanvas.width,tempCanvas.height);
  tempCtx.drawImage(canvas,0,0);

  const image=tempCanvas.toDataURL("image/png");
  const pdf =new jsPDF("landscape","mm","a4");
  // A4 dimensions in mm: 297 x 210
  const margin=10;
  const imgWidth=297-margin*2;
  const imgHeight=(canvas.height*imgWidth)/canvas.width;
pdf.addImage(image,"PNG",margin,margin,imgWidth,Math.min(imgHeight,190));
pdf.save(`NoteCanvas-${Date.now()}.pdf`);

showToast("Canvas exported as PDF document!","success");
};

return (
  <div className="app">
    {/* Top Header */}
    <Header
    theme={theme}
    toggleTheme={toggleTheme}
    onExportPNG={handleExportPNG}
    onExportPDF={handleExportPDf}
    />
    {/* { Main Layout Area -Pure Fullscreen Canvas Focus */}
    <main className="main-layout">
      <Workspace canvasRef={canvasRef} showToast={showToast} />
    </main>
    {/* Floating Toast Feedback */}
    <Toast toasts={toasts} />
  </div>
);
}