import React, { useState } from "react";

const BACKEND = "https://resume-backend-eck9.onrender.com";

const TEMPLATES = [
  { id: "modern",    name: "Modern",    desc: "Two-column indigo accent",   emoji: "⚡", color: "#6366f1" },
  { id: "classic",   name: "Classic",   desc: "Traditional serif layout",   emoji: "📄", color: "#374151" },
  { id: "sidebar",   name: "Sidebar",   desc: "Dark panel + white content", emoji: "🗂️", color: "#1e293b" },
  { id: "minimal",   name: "Minimal",   desc: "Whitespace & grayscale",     emoji: "🤍", color: "#6b7280" },
  { id: "executive", name: "Executive", desc: "Navy & gold premium style",  emoji: "👔", color: "#c9a84c" },
  { id: "creative",  name: "Creative",  desc: "Bold rose badge accents",    emoji: "🎨", color: "#f43f5e" },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", phone:"", linkedin:"", education:"", skills:"", certifications:"", experience:"", projects:"" });
  const [template, setTemplate] = useState("modern");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const update = (k,v) => setForm(f=>({...f,[k]:v}));

  const generate = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BACKEND}/api/generate-resume`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, template}) });
      const data = await res.json();
      if (data.resume_html) { setResume(data.resume_html); setModelUsed(data.model_used||""); setStep(4); }
      else setError(data.error || "Generation failed");
    } catch(e) { setError("Network error: " + e.message); }
    setLoading(false);
  };

  const inp = (label, k, ph, multi, hint) => (
    <div style={{marginBottom:18}}>
      <label style={{display:"block",color:"#94a3b8",fontSize:13,marginBottom:6,fontWeight:600}}>{label}</label>
      {multi
        ? <textarea value={form[k]} onChange={e=>update(k,e.target.value)} placeholder={ph} rows={3} style={{width:"100%",padding:"11px 14px",background:"#0f172a",border:"1px solid #334155",borderRadius:10,color:"#e2e8f0",fontSize:14,boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/>
        : <input value={form[k]} onChange={e=>update(k,e.target.value)} placeholder={ph} style={{width:"100%",padding:"11px 14px",background:"#0f172a",border:"1px solid #334155",borderRadius:10,color:"#e2e8f0",fontSize:14,boxSizing:"border-box"}}/>}
      {hint && <div style={{color:"#475569",fontSize:12,marginTop:5}}>{hint}</div>}
    </div>
  );

  const card = {background:"#111827",borderRadius:20,padding:"32px 36px",maxWidth:640,margin:"0 auto",boxShadow:"0 24px 64px rgba(0,0,0,.6)",border:"1px solid #1e293b"};
  const btn = (label, onClick, disabled, sec) => sec
    ? <button onClick={onClick} style={{padding:"11px 20px",fontWeight:600,fontSize:14,borderRadius:12,cursor:"pointer",border:"1px solid #334155",background:"transparent",color:"#94a3b8"}}>{label}</button>
    : <button onClick={onClick} disabled={disabled} style={{padding:"11px 28px",fontWeight:700,fontSize:14,borderRadius:12,cursor:disabled?"not-allowed":"pointer",border:"none",background:disabled?"#334155":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:disabled?"#64748b":"#fff"}}>{label}</button>;

  const STEPS = ["Personal","Education","Experience","Template","Resume"];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a14",color:"#e2e8f0",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:"0 16px 40px"}}>
      <style>{`@media print{body>div>div:first-child,body>div>div:nth-child(2){display:none!important}body{background:white!important;padding:0!important}}`}</style>

      <div style={{textAlign:"center",padding:"36px 0 24px"}}>
        <div style={{fontSize:36,fontWeight:800,background:"linear-gradient(135deg,#818cf8,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ ResumeAI</div>
        <div style={{color:"#64748b",fontSize:14,marginTop:4}}>AI-powered • 6 professional templates</div>
      </div>

      {step < 4 && (
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-start",gap:0,marginBottom:28}}>
          {STEPS.map((s,i) => (
            <React.Fragment key={i}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,background:i<step?"#6366f1":i===step?"#818cf8":"#1e293b",color:i<=step?"#fff":"#475569",border:i===step?"2px solid #a5b4fc":"2px solid transparent"}}>
                  {i<step?"✓":i+1}
                </div>
                <div style={{fontSize:10,color:i===step?"#a5b4fc":"#475569",marginTop:4,fontWeight:i===step?700:400}}>{s}</div>
              </div>
              {i<4 && <div style={{width:32,height:2,background:i<step?"#6366f1":"#1e293b",marginTop:13,marginBottom:18}}/>}
            </React.Fragment>
          ))}
        </div>
      )}

      {step===0 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>👤 Personal Info</h2>
        {inp("Full Name *","name","Jane Smith")}
        {inp("Email *","email","jane@email.com")}
        {inp("Phone","phone","+91 9876543210")}
        {inp("LinkedIn URL","linkedin","linkedin.com/in/janesmith")}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>{btn("Next →",()=>setStep(1),!form.name||!form.email)}</div>
      </div>}

      {step===1 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>🎓 Education & Skills</h2>
        {inp("Education *","education","B.Tech CSE, XYZ University, 2024, CGPA: 8.5",true,"Include degree, university, year, GPA")}
        {inp("Skills *","skills","Python, React, Node.js, SQL, Machine Learning",true,"List technical and soft skills")}
        {inp("Certifications","certifications","AWS Cloud Practitioner (2024), Google Analytics",true)}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{btn("← Back",()=>setStep(0),false,true)}{btn("Next →",()=>setStep(2),!form.education||!form.skills)}</div>
      </div>}

      {step===2 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>💼 Experience & Projects</h2>
        {inp("Work Experience","experience","Software Intern @ ABC Corp (Jun–Aug 2023): Built REST APIs, improved perf by 30%",true,"Include company, role, dates, achievements")}
        {inp("Projects","projects","E-Commerce Platform: React + Node.js + MongoDB, 500+ users",true,"Include tech stack and impact")}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{btn("← Back",()=>setStep(1),false,true)}{btn("Next →",()=>setStep(3))}</div>
      </div>}

      {step===3 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>🎨 Choose Template</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={()=>setTemplate(t.id)} style={{padding:"16px 14px",borderRadius:14,cursor:"pointer",textAlign:"center",background:template===t.id?`${t.color}18`:"#0f172a",border:`2px solid ${template===t.id?t.color:"#1e293b"}`,transform:template===t.id?"scale(1.04)":"scale(1)",transition:"all .2s"}}>
              <div style={{fontSize:24,marginBottom:6}}>{t.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,color:template===t.id?t.color:"#cbd5e1",marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:11,color:"#475569",lineHeight:1.4}}>{t.desc}</div>
            </div>
          ))}
        </div>
        {error && <div style={{color:"#f87171",background:"#2a1a1a",padding:"12px 16px",borderRadius:10,fontSize:13,marginBottom:16,border:"1px solid #7f1d1d"}}>⚠️ {error}</div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>{btn("← Back",()=>setStep(2),false,true)}{btn(loading?"⏳ Generating...":"✨ Generate Resume",generate,loading)}</div>
      </div>}

      {step===4 && <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <h2 style={{color:"#818cf8",margin:0,fontSize:22}}>✅ Your Resume</h2>
            {modelUsed && <div style={{color:"#475569",fontSize:12,marginTop:4}}>Generated with {modelUsed.split("/")[1]}</div>}
          </div>
          <div style={{display:"flex",gap:10}}>
            {btn("← Edit",()=>setStep(3),false,true)}
            {btn("🖨️ Print / PDF",()=>window.print())}
          </div>
        </div>
        <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.7)"}} dangerouslySetInnerHTML={{__html:resume}}/>
      </div>}
    </div>
  );
}