import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";

function App() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const apiUrl = "https://resume-backend-eck9.onrender.com";
      const res = await fetch(`${apiUrl}/api/generate-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResume(data);
      setActiveTab("preview");
    } catch (err) {
      alert("Error generating resume. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)",boxShadow:"0 2px 20px rgba(0,0,0,0.3)"}}>
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="#">
            <span style={{color:"#a78bfa"}}>◈</span> ResumeAI
            <span className="badge ms-2" style={{background:"#a78bfa",fontSize:"0.6rem",verticalAlign:"middle"}}>BETA</span>
          </a>
        </div>
      </nav>

      <div style={{background:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",minHeight:"100vh",paddingTop:"90px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",left:"5%",width:"400px",height:"400px",background:"radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(40px)"}}></div>
        <div style={{position:"absolute",bottom:"10%",right:"5%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(40px)"}}></div>

        <div className="container py-4">
          <div className="row justify-content-center text-center mb-4">
            <div className="col-lg-8">
              <span className="badge px-3 py-2 mb-3" style={{background:"rgba(167,139,250,0.2)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.3)",borderRadius:"20px"}}>✦ AI-Powered · Instant · Professional</span>
              <h1 className="fw-bold mb-3" style={{fontSize:"clamp(2rem,5vw,3.5rem)",color:"white",lineHeight:1.2}}>
                Build Your Dream <br/>
                <span style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Resume</span> in Seconds
              </h1>
              <p className="mb-4" style={{color:"rgba(255,255,255,0.7)",fontSize:"1.1rem"}}>Powered by Claude AI — the most advanced resume generator for students and fresh graduates</p>
              <div className="d-flex justify-content-center gap-4 flex-wrap mb-4">
                {[["10K+","Resumes Created"],["95%","Interview Rate"],["30s","Generation Time"]].map(([num,label])=>(
                  <div key={label} className="text-center">
                    <div className="fw-bold fs-4" style={{color:"#a78bfa"}}>{num}</div>
                    <div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem"}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex gap-2 p-1 rounded-pill" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <button onClick={()=>setActiveTab("form")} className="btn btn-sm px-4 py-2 rounded-pill fw-semibold" style={{background:activeTab==="form"?"linear-gradient(135deg,#a78bfa,#7c3aed)":"transparent",color:activeTab==="form"?"white":"rgba(255,255,255,0.5)",border:"none",transition:"all 0.3s"}}>
                01 Fill Details
              </button>
              <span className="d-flex align-items-center px-1" style={{color:"rgba(255,255,255,0.3)"}}>→</span>
              <button onClick={()=>resume&&setActiveTab("preview")} className="btn btn-sm px-4 py-2 rounded-pill fw-semibold" style={{background:activeTab==="preview"?"linear-gradient(135deg,#a78bfa,#7c3aed)":"transparent",color:activeTab==="preview"?"white":"rgba(255,255,255,0.3)",border:"none",cursor:resume?"pointer":"not-allowed",transition:"all 0.3s"}}>
                02 Your Resume
              </button>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px",backdropFilter:"blur(20px)",padding:"2rem",boxShadow:"0 25px 50px rgba(0,0,0,0.4)"}}>
                {activeTab==="form" ? <ResumeForm onGenerate={handleGenerate} loading={loading}/> : <ResumePreview resume={resume} onBack={()=>setActiveTab("form")}/>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-3" style={{color:"rgba(255,255,255,0.3)",fontSize:"0.8rem"}}>Built with Claude AI · ResumeAI © 2026 · Made for Students</div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');*{font-family:'DM Sans',sans-serif;box-sizing:border-box;}h1,.navbar-brand{font-family:'Syne',sans-serif!important;}body{margin:0;background:#0f0c29;}::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-thumb{background:#a78bfa;border-radius:3px;}`}</style>
    </>
  );
}
export default App;

