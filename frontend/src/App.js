import React, { useState } from "react";

const BACKEND = "https://resume-backend-eck9.onrender.com";

const TEMPLATES = [
  { id: "modern",    name: "Modern",    emoji: "⚡", color: "#6366f1", desc: "Clean indigo accent" },
  { id: "classic",   name: "Classic",   emoji: "📜", color: "#92400e", desc: "Traditional serif" },
  { id: "sidebar",   name: "Sidebar",   emoji: "🗂️", color: "#0f766e", desc: "Dark panel layout" },
  { id: "minimal",   name: "Minimal",   emoji: "◻️", color: "#374151", desc: "Pure whitespace" },
  { id: "executive", name: "Executive", emoji: "👔", color: "#b45309", desc: "Navy & gold luxury" },
  { id: "creative",  name: "Creative",  emoji: "🎨", color: "#e11d48", desc: "Bold & colorful" },
];

const TEMPLATE_HTML = {
  modern: (d) => `<div style="font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;background:#fff;min-height:1000px"><div style="display:flex"><div style="width:8px;background:linear-gradient(180deg,#6366f1,#8b5cf6);flex-shrink:0"></div><div style="flex:1;padding:40px"><div style="border-bottom:3px solid #6366f1;padding-bottom:20px;margin-bottom:28px"><h1 style="margin:0;font-size:32px;font-weight:800;color:#1e1b4b">${d.name}</h1><p style="margin:6px 0 0;color:#6366f1;font-size:14px;font-weight:600">${d.email} ${d.phone ? "• " + d.phone : ""} ${d.linkedin ? "• " + d.linkedin : ""}</p></div><div style="display:grid;grid-template-columns:1fr 280px;gap:32px"><div><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin-bottom:14px">Experience</h2><p style="margin:0;font-size:14px;color:#374151;line-height:1.7">${d.experience || "—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin:24px 0 14px">Projects</h2><p style="margin:0;font-size:14px;color:#374151;line-height:1.7">${d.projects || "—"}</p></div><div><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin-bottom:14px">Education</h2><p style="margin:0;font-size:13px;color:#374151;line-height:1.7">${d.education || "—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin:20px 0 14px">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${(d.skills||"").split(",").map(s=>`<span style="background:#ede9fe;color:#6366f1;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">${s.trim()}</span>`).join("")}</div><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin:20px 0 14px">Certifications</h2><p style="margin:0;font-size:13px;color:#374151;line-height:1.7">${d.certifications || "—"}</p></div></div></div></div></div>`,

  classic: (d) => `<div style="font-family:Georgia,serif;max-width:780px;margin:0 auto;background:#fff;padding:50px;min-height:1000px"><div style="text-align:center;border-bottom:2px solid #1a1a1a;padding-bottom:20px;margin-bottom:28px"><h1 style="margin:0;font-size:30px;font-weight:700;color:#1a1a1a;letter-spacing:2px;text-transform:uppercase">${d.name}</h1><p style="margin:8px 0 0;font-size:13px;color:#555;font-family:'Segoe UI',sans-serif">${d.email} ${d.phone ? "| " + d.phone : ""} ${d.linkedin ? "| " + d.linkedin : ""}</p></div><h2 style="font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;margin:0 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px">Education</h2><p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.7">${d.education||"—"}</p><h2 style="font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;margin:0 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px">Experience</h2><p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.7">${d.experience||"—"}</p><h2 style="font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;margin:0 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px">Skills</h2><p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.7">${d.skills||"—"}</p><h2 style="font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;margin:0 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px">Projects</h2><p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.7">${d.projects||"—"}</p><h2 style="font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;margin:0 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px">Certifications</h2><p style="margin:0;font-size:14px;color:#333;line-height:1.7">${d.certifications||"—"}</p></div>`,

  sidebar: (d) => `<div style="font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;display:flex;min-height:1000px"><div style="width:260px;background:#0f172a;color:#fff;padding:36px 24px;flex-shrink:0"><div style="margin-bottom:28px"><h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;line-height:1.3">${d.name}</h1><p style="margin:8px 0 0;font-size:12px;color:#94a3b8">${d.email}</p>${d.phone?`<p style="margin:4px 0 0;font-size:12px;color:#94a3b8">${d.phone}</p>`:""}</div><h3 style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin:0 0 10px">Skills</h3><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:24px">${(d.skills||"").split(",").map(s=>`<span style="background:#1e293b;color:#a5b4fc;padding:3px 8px;border-radius:4px;font-size:11px">${s.trim()}</span>`).join("")}</div><h3 style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin:0 0 10px">Education</h3><p style="font-size:12px;color:#cbd5e1;line-height:1.6;margin:0 0 24px">${d.education||"—"}</p><h3 style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin:0 0 10px">Certifications</h3><p style="font-size:12px;color:#cbd5e1;line-height:1.6;margin:0">${d.certifications||"—"}</p></div><div style="flex:1;padding:36px 32px;background:#f8fafc"><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#0f172a;text-transform:uppercase;border-left:4px solid #6366f1;padding-left:10px;margin:0 0 12px">Experience</h2><p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px">${d.experience||"—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:2px;color:#0f172a;text-transform:uppercase;border-left:4px solid #6366f1;padding-left:10px;margin:0 0 12px">Projects</h2><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">${d.projects||"—"}</p></div></div>`,

  minimal: (d) => `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:720px;margin:0 auto;background:#fff;padding:60px;min-height:1000px"><h1 style="margin:0 0 6px;font-size:36px;font-weight:300;color:#111;letter-spacing:-1px">${d.name}</h1><p style="margin:0 0 48px;font-size:13px;color:#999;letter-spacing:1px">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</p><div style="display:grid;grid-template-columns:120px 1fr;gap:20px 40px;align-items:start"><span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">Education</span><p style="margin:0;font-size:14px;color:#333;line-height:1.8">${d.education||"—"}</p><span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">Experience</span><p style="margin:0;font-size:14px;color:#333;line-height:1.8">${d.experience||"—"}</p><span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">Skills</span><p style="margin:0;font-size:14px;color:#333;line-height:1.8">${d.skills||"—"}</p><span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">Projects</span><p style="margin:0;font-size:14px;color:#333;line-height:1.8">${d.projects||"—"}</p><span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">Certs</span><p style="margin:0;font-size:14px;color:#333;line-height:1.8">${d.certifications||"—"}</p></div></div>`,

  executive: (d) => `<div style="font-family:Georgia,serif;max-width:800px;margin:0 auto;background:#fdfaf6;min-height:1000px"><div style="background:#0f172a;padding:40px 48px"><h1 style="margin:0;font-size:32px;font-weight:700;color:#c9a84c;letter-spacing:2px;text-transform:uppercase">${d.name}</h1><p style="margin:10px 0 0;font-size:13px;color:#94a3b8;font-family:'Segoe UI',sans-serif;letter-spacing:1px">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</p></div><div style="padding:40px 48px"><div style="border-top:2px solid #c9a84c;border-bottom:1px solid #e5d5b0;padding:8px 0;margin-bottom:28px"></div><h2 style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin:0 0 10px">Education</h2><p style="font-size:14px;color:#1a1a1a;line-height:1.8;margin:0 0 24px">${d.education||"—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin:0 0 10px">Professional Experience</h2><p style="font-size:14px;color:#1a1a1a;line-height:1.8;margin:0 0 24px">${d.experience||"—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin:0 0 10px">Core Competencies</h2><p style="font-size:14px;color:#1a1a1a;line-height:1.8;margin:0 0 24px">${d.skills||"—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin:0 0 10px">Key Projects</h2><p style="font-size:14px;color:#1a1a1a;line-height:1.8;margin:0 0 24px">${d.projects||"—"}</p><h2 style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin:0 0 10px">Certifications</h2><p style="font-size:14px;color:#1a1a1a;line-height:1.8;margin:0">${d.certifications||"—"}</p></div></div>`,

  creative: (d) => `<div style="font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;background:#f8fafc;min-height:1000px;border-left:8px solid #e11d48"><div style="padding:40px 40px 20px"><h1 style="margin:0;font-size:34px;font-weight:900;color:#0f172a;line-height:1.1">${d.name}</h1><div style="width:60px;height:4px;background:linear-gradient(90deg,#e11d48,#f97316);margin:12px 0"></div><p style="margin:0 0 6px;font-size:13px;color:#64748b">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</p></div><div style="padding:0 40px 40px;display:grid;grid-template-columns:1fr 240px;gap:32px"><div><div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)"><h2 style="font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin:0 0 12px">💼 Experience</h2><p style="margin:0;font-size:14px;color:#334155;line-height:1.7">${d.experience||"—"}</p></div><div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.06)"><h2 style="font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin:0 0 12px">🚀 Projects</h2><p style="margin:0;font-size:14px;color:#334155;line-height:1.7">${d.projects||"—"}</p></div></div><div><div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)"><h2 style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin:0 0 10px">🎓 Education</h2><p style="margin:0;font-size:13px;color:#334155;line-height:1.6">${d.education||"—"}</p></div><div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)"><h2 style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin:0 0 10px">⚡ Skills</h2><div style="display:flex;flex-wrap:wrap;gap:5px">${(d.skills||"").split(",").map(s=>`<span style="background:#fff1f2;color:#e11d48;border:1px solid #fecdd3;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600">${s.trim()}</span>`).join("")}</div></div><div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)"><h2 style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin:0 0 10px">🏆 Certs</h2><p style="margin:0;font-size:13px;color:#334155;line-height:1.6">${d.certifications||"—"}</p></div></div></div></div>`,
};

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", phone:"", linkedin:"", education:"", skills:"", certifications:"", experience:"", projects:"" });
  const [template, setTemplate] = useState("modern");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useAI, setUseAI] = useState(false);
  const update = (k,v) => setForm(f=>({...f,[k]:v}));

  const generateLocal = (tpl) => {
    const t = tpl || template;
    const html = TEMPLATE_HTML[t] ? TEMPLATE_HTML[t](form) : TEMPLATE_HTML.modern(form);
    setResume(html);
    setStep(4);
  };

  const generateAI = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BACKEND}/api/generate-resume`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({...form, template})
      });
      const data = await res.json();
      if (data.resume_html) { setResume(data.resume_html); setStep(4); }
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
      <style>{`@media print{body>div>div:first-child,body>div>div:nth-child(2){display:none!important}}`}</style>

      <div style={{textAlign:"center",padding:"36px 0 24px"}}>
        <div style={{fontSize:36,fontWeight:800,background:"linear-gradient(135deg,#818cf8,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ ResumeAI</div>
        <div style={{color:"#64748b",fontSize:14,marginTop:4}}>6 professional templates • Instant preview</div>
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
        {inp("Full Name *","name","Bhanu Sairam")}
        {inp("Email *","email","bhanu@email.com")}
        {inp("Phone","phone","+91 9876543210")}
        {inp("LinkedIn URL","linkedin","linkedin.com/in/bhanusairam")}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>{btn("Next →",()=>setStep(1),!form.name||!form.email)}</div>
      </div>}

      {step===1 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>🎓 Education & Skills</h2>
        {inp("Education *","education","B.Tech CSE, XYZ University, 2024, CGPA: 8.5",true)}
        {inp("Skills *","skills","Python, React, Node.js, SQL, AWS",true)}
        {inp("Certifications","certifications","AWS Cloud Practitioner (2024)",true)}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{btn("← Back",()=>setStep(0),false,true)}{btn("Next →",()=>setStep(2),!form.education||!form.skills)}</div>
      </div>}

      {step===2 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>💼 Experience & Projects</h2>
        {inp("Work Experience","experience","Software Intern @ ABC Corp (Jun–Aug 2023): Built REST APIs",true)}
        {inp("Projects","projects","E-Commerce Platform: React + Node.js + MongoDB, 500+ users",true)}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{btn("← Back",()=>setStep(1),false,true)}{btn("Next →",()=>setStep(3))}</div>
      </div>}

      {step===3 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>🎨 Choose Template</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={()=>setTemplate(t.id)} style={{padding:"16px 14px",borderRadius:14,cursor:"pointer",textAlign:"center",background:template===t.id?`${t.color}22`:"#0f172a",border:`2px solid ${template===t.id?t.color:"#1e293b"}`,transform:template===t.id?"scale(1.04)":"scale(1)",transition:"all .2s"}}>
              <div style={{fontSize:24,marginBottom:6}}>{t.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,color:template===t.id?t.color:"#cbd5e1",marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:11,color:"#475569"}}>{t.desc}</div>
            </div>
          ))}
        </div>
        {error && <div style={{color:"#f87171",background:"#2a1a1a",padding:"12px 16px",borderRadius:10,fontSize:13,marginBottom:16,border:"1px solid #7f1d1d"}}>⚠️ {error}</div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
          {btn("← Back",()=>setStep(2),false,true)}
          <div style={{display:"flex",gap:10}}>
            {btn("⚡ Instant Preview",()=>generateLocal(),false,true)}
            {btn(loading?"⏳ Generating...":"✨ AI Generate",generateAI,loading)}
          </div>
        </div>
        <div style={{color:"#475569",fontSize:12,textAlign:"center",marginTop:12}}>⚡ Instant = fast local render &nbsp;|&nbsp; ✨ AI = smarter formatting</div>
      </div>}

      {step===4 && <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
          <h2 style={{color:"#818cf8",margin:0,fontSize:20}}>✅ Your Resume</h2>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {btn("← Edit",()=>setStep(3),false,true)}
            {btn("🖨️ Print / PDF",()=>window.print())}
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {TEMPLATES.map(t=>(
            <button key={t.id} onClick={()=>{setTemplate(t.id);setResume(TEMPLATE_HTML[t.id](form));}} style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${template===t.id?t.color:"#1e293b"}`,background:template===t.id?`${t.color}22`:"#111827",color:template===t.id?t.color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
        <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.7)"}} dangerouslySetInnerHTML={{__html:resume}}/>
      </div>}
    </div>
  );
}