import React, { useRef, useEffect } from "react";

function ResumePreview({ resume, onBack }) {
  const ref = useRef(null);

  useEffect(() => {
    if (resume) {
      try { localStorage.setItem("lastResume", JSON.stringify(resume)); } catch(e) {}
    }
  }, [resume]);

  const handlePDF = () => {
    const content = ref.current.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            body { margin: 0; padding: 0; font-family: Georgia, serif; }
            #resume { padding: 20px; }
          </style>
        </head>
        <body>
          <div id="resume">${content}</div>
          <script>
            window.onload = function() {
              const el = document.getElementById('resume');
              html2pdf().set({
                margin: 10,
                filename: 'my-resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              }).from(el).save().then(() => setTimeout(() => window.close(), 1000));
            };
          </script>
        </body>
      </html>
    `);
    w.document.close();
  };

  const content = resume?.resume_html || resume?.resume || JSON.stringify(resume, null, 2);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h5 style={{color:"white",fontWeight:"700",margin:0}}>? Your Resume is Ready!</h5>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:"4px 0 0"}}>Review and download your AI-generated resume</p>
        </div>
        <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:"8px",padding:"6px 14px",fontSize:"0.8rem",color:"#4ade80",fontWeight:"600"}}>
          ? Saved locally
        </div>
      </div>

      <div style={{background:"white",borderRadius:"16px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",height:"6px"}}></div>
        <div ref={ref} style={{padding:"40px",fontFamily:"Georgia,serif",lineHeight:"1.7",color:"#1a1a1a",fontSize:"0.95rem",minHeight:"500px"}}
          dangerouslySetInnerHTML={{__html:content}}/>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <button onClick={onBack} className="btn px-4 py-2"
          style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px"}}>
          ?? Regenerate Resume
        </button>
        <button onClick={handlePDF} className="btn px-5 py-2 fw-semibold"
          style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed,#ec4899)",color:"white",border:"none",borderRadius:"10px",boxShadow:"0 4px 20px rgba(124,58,237,0.4)"}}>
          ?? Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResumePreview;
