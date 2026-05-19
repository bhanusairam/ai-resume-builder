import React, { useState } from "react";

function ResumeForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({name:"",email:"",phone:"",linkedin:"",education:"",skills:"",projects:"",certifications:"",experience:""});
  const [step, setStep] = useState(0);

  const steps = [
    {title:"Personal Info",icon:"👤",desc:"Your basic contact details",fields:[
      {key:"name",label:"Full Name",placeholder:"e.g. Bhanu Sairam",type:"input"},
      {key:"email",label:"Email Address",placeholder:"e.g. bhanu@email.com",type:"input"},
      {key:"phone",label:"Phone Number",placeholder:"e.g. +91 9999999999",type:"input"},
      {key:"linkedin",label:"LinkedIn URL",placeholder:"e.g. linkedin.com/in/bhanu",type:"input"},
    ]},
    {title:"Education & Skills",icon:"🎓",desc:"Your academic background and technical skills",fields:[
      {key:"education",label:"Education",placeholder:"e.g. B.Tech in CSE, XYZ University, 2024, CGPA: 8.5",type:"textarea"},
      {key:"skills",label:"Technical Skills",placeholder:"e.g. Python, React, Node.js, SQL, Machine Learning, Git...",type:"textarea"},
    ]},
    {title:"Experience & Projects",icon:"💼",desc:"Work experience, projects and certifications",fields:[
      {key:"experience",label:"Work Experience",placeholder:"e.g. Software Intern at XYZ Corp (June 2023) - Built REST APIs...",type:"textarea"},
      {key:"projects",label:"Projects",placeholder:"e.g. AI Resume Builder - Built using React + FastAPI + Claude AI...",type:"textarea"},
      {key:"certifications",label:"Certifications",placeholder:"e.g. AWS Certified, Google Data Analytics...",type:"textarea"},
    ]}
  ];

  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});

  const inp = {background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"white",padding:"12px 16px",width:"100%",fontSize:"0.95rem",outline:"none"};
  const lbl = {color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",fontWeight:"600",marginBottom:"6px",letterSpacing:"0.5px",textTransform:"uppercase",display:"block"};

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4 flex-wrap">
        {steps.map((s,i)=>(
          <React.Fragment key={i}>
            <div onClick={()=>setStep(i)} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",padding:"8px 14px",borderRadius:"20px",background:step===i?"rgba(167,139,250,0.2)":"transparent",border:step===i?"1px solid rgba(167,139,250,0.4)":"1px solid transparent",transition:"all 0.3s"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:"700",background:i<step?"linear-gradient(135deg,#a78bfa,#7c3aed)":step===i?"rgba(167,139,250,0.3)":"rgba(255,255,255,0.1)",color:i<step?"white":step===i?"#a78bfa":"rgba(255,255,255,0.4)",border:step===i?"1px solid #a78bfa":"none"}}>
                {i<step?"✓":i+1}
              </div>
              <span className="d-none d-sm-inline" style={{fontSize:"0.85rem",fontWeight:"600",color:step===i?"#a78bfa":"rgba(255,255,255,0.4)"}}>{s.title}</span>
            </div>
            {i<steps.length-1&&<div style={{height:"1px",width:"20px",background:i<step?"#a78bfa":"rgba(255,255,255,0.1)"}}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="text-center mb-4">
        <div style={{fontSize:"1.8rem",marginBottom:"6px"}}>{steps[step].icon}</div>
        <h5 style={{color:"white",fontWeight:"700",marginBottom:"4px"}}>{steps[step].title}</h5>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:0}}>{steps[step].desc}</p>
      </div>

      <div className="row g-3 mb-4">
        {steps[step].fields.map(f=>(
          <div key={f.key} className={f.type==="input"?"col-md-6":"col-12"}>
            <label style={lbl}>{f.label}</label>
            {f.type==="input"
              ? <input style={inp} name={f.key} value={formData[f.key]} onChange={handleChange} placeholder={f.placeholder} onFocus={e=>{e.target.style.borderColor="rgba(167,139,250,0.6)";e.target.style.background="rgba(167,139,250,0.08)"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.12)";e.target.style.background="rgba(255,255,255,0.06)"}}/>
              : <textarea style={{...inp,height:"100px",resize:"vertical"}} name={f.key} value={formData[f.key]} onChange={handleChange} placeholder={f.placeholder} onFocus={e=>{e.target.style.borderColor="rgba(167,139,250,0.6)";e.target.style.background="rgba(167,139,250,0.08)"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.12)";e.target.style.background="rgba(255,255,255,0.06)"}}/>
            }
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button onClick={()=>setStep(s=>s-1)} disabled={step===0} className="btn px-4 py-2" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",opacity:step===0?0.3:1,cursor:step===0?"not-allowed":"pointer"}}>← Back</button>
        {step<steps.length-1
          ? <button onClick={()=>setStep(s=>s+1)} className="btn px-5 py-2 fw-semibold" style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"white",border:"none",borderRadius:"10px"}}>Continue →</button>
          : <button onClick={()=>onGenerate(formData)} disabled={loading} className="btn px-5 py-2 fw-semibold" style={{background:loading?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#a78bfa,#7c3aed,#ec4899)",color:"white",border:"none",borderRadius:"10px",minWidth:"200px",cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":"0 4px 20px rgba(124,58,237,0.4)"}}>
              {loading?<span><span className="spinner-border spinner-border-sm me-2"></span>Generating...</span>:"🚀 Generate My Resume"}
            </button>
        }
      </div>

      <div className="mt-3 p-3 rounded-3" style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)"}}>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem",margin:0}}>💡 <strong style={{color:"#a78bfa"}}>Tip:</strong> The more detail you add, the better your AI-generated resume will be.</p>
      </div>
    </div>
  );
}
export default ResumeForm;