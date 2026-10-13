import { useState,useRef,useEffect } from "react";
import {PenTool,Moon,Sun,Image as ImageIcon,FileText,ChevronDown, Download} from "lucide-react";
export default function Header({
    theme,toggleTheme,onExportPNG,onExportPDF})
{
    const [exportOpen,setExportOpen]=useState(false);
    const exportRef=useRef(null);
    // Close dropdown on outside click
    useEffect(()=>{
        function handleClickOutside(event){
            if(exportRef.current && !exportRef.current.contains(event.target)){
                setExportOpen(false);
            }
        }
    document.addEventListener("mousedown",handleClickOutside);
    return ()=> document.removeEventListener("mousedown",handleClickOutside);
    },[]);
    return (
        <header className="header">
            {/* Brand Section - Simple and clean NoteCanvas branding */}
            <div className="logo-section">
                <div className="logo-badge" title="NoteCanvas">
                    <PenTool size={20} strokeWidth={2.4} />
                </div>
                <h1 className="logo-title">NoteCanvas</h1>
            </div>
            {/* Header Actions */}
            <div className="header-actions">
                {/* Export Dropdown */}
                <div style={{position:"relative"}} ref={exportRef}>
                    <button className="btn-secondary"
                    onClick={()=>setExportOpen((prev)=> !prev)}
                    aria-expanded={exportOpen}
                    aria-haspopup="true">
                    <Download size={15} />
                    <span>Export</span>
                    <ChevronDown size={14} style={{opacity:0.7}} />
                    </button>
                    {
                        exportOpen && (
                            <div className="dropdown-menu">
                                <button
                                className="dropdown-item"
                                onClick={()=>{
                                    onExportPNG();
                                    setExportOpen(false);
                                }}
                                >
                                <ImageIcon size={16} color="var(--accent-primary)" />
                                <span>Export as PNG</span> 
                                </button>
                                <button
                                className="dropdown-item"
                                onClick={()=>{
                                    onExportPDF();
                                    setExportOpen(false);
                                }}
                                >
                                <FileText size={16} color="#ef4444" />
                                <span>Export as PDF</span>
                                </button>
                            </div>
                        )
                    }

                </div>
                {/* Theme Toggle */}
                <button
                className="btn-icon"
                onClick={toggleTheme}
                title={`Switch to ${theme==="dark" ? "Light" : "Dark"} Mode`}
                aria-label="Toggle Theme"
                >
                    {theme==="dark" ? <Sun size={18} color="#f59e0b"/> : <Moon size={18} />}
                </button>
            </div>
        </header>
    );
}