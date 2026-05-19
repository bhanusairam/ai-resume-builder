import React, { useRef } from "react";

function ResumePreview({ resume, onBack }) {
  const ref = useRef(null);
  const handlePrint = () => {
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>My Resume</title><style>body{font-family:Georgia,serif;margin:40px;line-height:1.7;color:#1a1a1a;}</style></head><body>${ref.current.innerHTML}</body></html>`);
    w.document.close(); w.print();
  };
  const content = resume?.resume_html || resume?.resume || JSON.stringify(resume, null, 2);
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h5 style={{color:"white",fontWeight:"700",margin:0}}>✅ Your Resume is Ready!</h5>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:0}}>Review and download your AI-generated resume</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={onBack} className="btn px-3 py-2" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",fontSize:"0.85rem"}}>← Edit Details</button>
          <button onClick={handlePrint} className="btn px-4 py-2 fw-semibold" style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"white",border:"none",borderRadius:"10px",fontSize:"0.85rem"}}>🖨️ Print / Save PDF</button>
        </div>
      </div>
      <div style={{background:"white",borderRadius:"16px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",height:"6px"}}></div>
        <div ref={ref} style={{padding:"40px",fontFamily:"Georgia,serif",lineHeight:"1.7",color:"#1a1a1a",fontSize:"0.95rem",minHeight:"500px"}} dangerouslySetInnerHTML={{__html:content}}/>
      </div>
      <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <button onClick={onBack} className="btn px-4 py-2" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px"}}>✏️ Regenerate Resume</button>
        <button onClick={handlePrint} className="btn px-5 py-2 fw-semibold" style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed,#ec4899)",color:"white",border:"none",borderRadius:"10px",boxShadow:"0 4px 20px rgba(124,58,237,0.4)"}}>📥 Download as PDF</button>
      </div>
    </div>
  );
}
export default ResumePreview;