import React, { useState } from "react";

function ResumeForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    name:"", email:"", phone:"", linkedin:"",
    ssc_school:"", ssc_board:"", ssc_percentage:"", ssc_year:"",
    inter_college:"", inter_board:"", inter_percentage:"", inter_year:"",
    btech_college:"", btech_university:"", btech_branch:"", btech_cgpa:"", btech_year:"",
    skills:"", projects:"", certifications:"", experience:""
  });
  const [step, setStep] = useState(0);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const inp = {background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"white",padding:"12px 16px",width:"100%",fontSize:"0.95rem",outline:"none"};
  const lbl = {color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",fontWeight:"600",marginBottom:"6px",letterSpacing:"0.5px",textTransform:"uppercase",display:"block"};
  const sectionHead = {color:"#a78bfa",fontWeight:"700",fontSize:"0.9rem",marginBottom:"10px",marginTop:"6px",paddingBottom:"6px",borderBottom:"1px solid rgba(167,139,250,0.2)"};
  const focusIn = (e) => { e.target.style.borderColor="rgba(167,139,250,0.6)"; e.target.style.background="rgba(167,139,250,0.08)"; };
  const focusOut = (e) => { e.target.style.borderColor="rgba(255,255,255,0.12)"; e.target.style.background="rgba(255,255,255,0.06)"; };

  const Field = ({name, placeholder, col="col-md-6"}) => (
    <div className={col}>
      <label style={lbl}>{name.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</label>
      <input style={inp} name={name} value={formData[name]} onChange={handleChange}
        placeholder={placeholder} onFocus={focusIn} onBlur={focusOut}/>
    </div>
  );

  const TextArea = ({name, placeholder}) => (
    <div className="col-12">
      <label style={lbl}>{name.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</label>
      <textarea style={{...inp,height:"100px",resize:"vertical"}} name={name}
        value={formData[name]} onChange={handleChange} placeholder={placeholder}
        onFocus={focusIn} onBlur={focusOut}/>
    </div>
  );

  const steps = [
    { title:"Personal Info", icon:"??", desc:"Your basic contact details" },
    { title:"Education",     icon:"??", desc:"SSC, Inter and B.Tech details" },
    { title:"Skills & Work", icon:"??", desc:"Skills, experience, projects and certifications" },
  ];

  const buildEducation = () => {
    const parts = [];
    if (formData.btech_college) parts.push(`B.Tech in ${formData.btech_branch||"Engineering"}, ${formData.btech_college}, ${formData.btech_university||""}, Graduating: ${formData.btech_year||""}, CGPA: ${formData.btech_cgpa||""}`);
    if (formData.inter_college) parts.push(`Intermediate (${formData.inter_board||""}), ${formData.inter_college}, ${formData.inter_percentage||""}%, Year: ${formData.inter_year||""}`);
    if (formData.ssc_school)   parts.push(`SSC (${formData.ssc_board||""}), ${formData.ssc_school}, ${formData.ssc_percentage||""}%, Year: ${formData.ssc_year||""}`);
    return parts.join("\n");
  };

  const handleGenerate = (template) => {
    const payload = {
      name: formData.name, email: formData.email, phone: formData.phone,
      linkedin: formData.linkedin, education: buildEducation(),
      skills: formData.skills, experience: formData.experience,
      projects: formData.projects, certifications: formData.certifications, template,
    };
    onGenerate(payload);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4 flex-wrap">
        {steps.map((s,i)=>(
          <React.Fragment key={i}>
            <div onClick={()=>setStep(i)} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",padding:"8px 14px",borderRadius:"20px",background:step===i?"rgba(167,139,250,0.2)":"transparent",border:step===i?"1px solid rgba(167,139,250,0.4)":"1px solid transparent",transition:"all 0.3s"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:"700",background:i<step?"linear-gradient(135deg,#a78bfa,#7c3aed)":step===i?"rgba(167,139,250,0.3)":"rgba(255,255,255,0.1)",color:i<step?"white":step===i?"#a78bfa":"rgba(255,255,255,0.4)",border:step===i?"1px solid #a78bfa":"none"}}>
                {i<step?"?":i+1}
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

      {step===0 && (
        <div className="row g-3 mb-4">
          <Field name="name"     placeholder="e.g. Bhanu Sairam"/>
          <Field name="email"    placeholder="e.g. bhanu@email.com"/>
          <Field name="phone"    placeholder="e.g. +91 9999999999"/>
          <Field name="linkedin" placeholder="e.g. linkedin.com/in/bhanu"/>
        </div>
      )}

      {step===1 && (
        <div className="mb-4">
          <div style={sectionHead}>?? B.Tech / Degree</div>
          <div className="row g-3 mb-4">
            <Field name="btech_college"    placeholder="e.g. XYZ Engineering College"/>
            <Field name="btech_university" placeholder="e.g. JNTUH / Osmania University"/>
            <Field name="btech_branch"     placeholder="e.g. Computer Science and Engineering" col="col-12"/>
            <Field name="btech_cgpa"       placeholder="e.g. 8.5"/>
            <Field name="btech_year"       placeholder="e.g. 2025"/>
          </div>
          <div style={sectionHead}>?? Intermediate (11th and 12th)</div>
          <div className="row g-3 mb-4">
            <Field name="inter_college"    placeholder="e.g. Sri Chaitanya Junior College"/>
            <Field name="inter_board"      placeholder="e.g. TSBIE / APBIE"/>
            <Field name="inter_percentage" placeholder="e.g. 92"/>
            <Field name="inter_year"       placeholder="e.g. 2021"/>
          </div>
          <div style={sectionHead}>?? SSC (10th)</div>
          <div className="row g-3">
            <Field name="ssc_school"      placeholder="e.g. Narayana High School"/>
            <Field name="ssc_board"       placeholder="e.g. CBSE / SSC Board"/>
            <Field name="ssc_percentage"  placeholder="e.g. 95"/>
            <Field name="ssc_year"        placeholder="e.g. 2019"/>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="row g-3 mb-4">
          <TextArea name="skills"         placeholder="e.g. Python, React, Node.js, SQL, Machine Learning, Git..."/>
          <TextArea name="experience"     placeholder="e.g. Software Intern at XYZ Corp (June 2023) - Built REST APIs..."/>
          <TextArea name="projects"       placeholder="e.g. AI Resume Builder - Built using React + FastAPI + Claude AI..."/>
          <TextArea name="certifications" placeholder="e.g. AWS Certified Developer, Google Data Analytics..."/>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <button onClick={()=>setStep(s=>s-1)} disabled={step===0} className="btn px-4 py-2"
          style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",opacity:step===0?0.3:1,cursor:step===0?"not-allowed":"pointer"}}>
          Back
        </button>
        {step < steps.length-1 ? (
          <button onClick={()=>setStep(s=>s+1)} className="btn px-4 py-2"
            style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"white",border:"none",borderRadius:"10px",fontWeight:"600"}}>
            Next
          </button>
        ) : (
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            {["modern","classic","minimal","creative"].map(t=>(
              <button key={t} onClick={()=>handleGenerate(t)} disabled={loading} className="btn px-3 py-2"
                style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"white",border:"none",borderRadius:"10px",fontWeight:"600",fontSize:"0.85rem",opacity:loading?0.6:1,cursor:loading?"not-allowed":"pointer",textTransform:"capitalize"}}>
                {loading?"Generating...":"Generate "+t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeForm;
