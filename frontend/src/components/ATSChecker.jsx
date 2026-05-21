import { useState, useEffect } from "react";

const BACKEND = "https://resume-backend-eck9.onrender.com";

function ScoreRing({ score }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Great" : score >= 50 ? "Average" : "Needs Work";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"}}>
      <svg width={radius*2} height={radius*2} style={{transform:"rotate(-90deg)"}}>
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="#2d2d4e" strokeWidth={stroke}/>
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={progress}
          strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s ease"}}/>
        <text x={radius} y={radius+2} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="28" fontWeight="800"
          style={{transform:`rotate(90deg)`,transformOrigin:`${radius}px ${radius}px`}}>{score}</text>
        <text x={radius} y={radius+26} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.4)" fontSize="11"
          style={{transform:`rotate(90deg)`,transformOrigin:`${radius}px ${radius}px`}}>/100</text>
      </svg>
      <span style={{padding:"0.25rem 1rem",borderRadius:"999px",fontSize:"0.85rem",fontWeight:"700",background:color+"33",color}}>{label}</span>
    </div>
  );
}

function ScoreBar({ label, value, max=100 }) {
  const pct = Math.round((value/max)*100);
  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{marginBottom:"0.85rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.3rem"}}>
        <span style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.8)",fontWeight:"600"}}>{label}</span>
        <span style={{fontSize:"0.87rem",color,fontWeight:"700"}}>{value}/{max}</span>
      </div>
      <div style={{height:"8px",borderRadius:"999px",background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:"999px",transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

export default function ATSChecker({ formData }) {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoChecked, setAutoChecked] = useState(false);

  useEffect(() => {
    if (formData) {
      const text = [
        formData.name || "",
        formData.email || "",
        formData.phone || "",
        formData.education ? "EDUCATION\n" + formData.education : "",
        formData.skills ? "SKILLS\n" + formData.skills : "",
        formData.experience ? "EXPERIENCE\n" + formData.experience : "",
        formData.projects ? "PROJECTS\n" + formData.projects : "",
        formData.certifications ? "CERTIFICATIONS\n" + formData.certifications : "",
      ].filter(Boolean).join("\n\n");
      setResumeText(text);
      setAutoChecked(false);
    }
  }, [formData]);

  useEffect(() => {
    if (resumeText && formData && !autoChecked && !result) {
      setAutoChecked(true);
      handleCheck(resumeText, jobDesc);
    }
  }, [resumeText]);

  const handleCheck = async (text=resumeText, jd=jobDesc) => {
    if (!text.trim()) { setError("Please paste your resume text."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${BACKEND}/api/ats-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: text, job_description: jd })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",paddingBottom:"3rem"}}>
      <div style={{padding:"2.5rem 1rem 2rem",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(167,139,250,0.2)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:"999px",padding:"0.3rem 0.9rem",fontSize:"0.78rem",fontWeight:"700",letterSpacing:"0.08em",marginBottom:"1rem",color:"#a78bfa"}}>
          ATS SCORE CHECKER
        </div>
        <h1 style={{fontWeight:"800",fontSize:"2rem",margin:"0 0 0.5rem",color:"white"}}>Beat the Applicant Tracking System</h1>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:"1rem",maxWidth:"520px",margin:"0 auto"}}>
          {formData ? "Your resume data has been loaded automatically!" : "Paste your resume and get an instant ATS score out of 100."}
        </p>
      </div>

      <div style={{maxWidth:"860px",margin:"0 auto",padding:"0 1rem"}}>
        {formData && (
          <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:"12px",padding:"0.85rem 1.25rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <span style={{fontSize:"1.25rem"}}>?</span>
            <div>
              <div style={{color:"#22c55e",fontWeight:"700",fontSize:"0.9rem"}}>Resume data loaded from your form!</div>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem"}}>Your name, skills, education, experience and projects are used automatically.</div>
            </div>
          </div>
        )}

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",backdropFilter:"blur(20px)",padding:"2rem",boxShadow:"0 25px 50px rgba(0,0,0,0.4)"}}>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={{fontWeight:"700",color:"#a78bfa",display:"block",marginBottom:"0.5rem"}}>
              Resume Text {formData && <span style={{color:"rgba(34,197,94,0.8)",fontSize:"0.8rem",fontWeight:"500"}}>(auto-filled from your form)</span>}
            </label>
            <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} rows={8}
              placeholder="Paste your resume text here..."
              style={{width:"100%",border:"2px solid rgba(167,139,250,0.3)",borderRadius:"10px",padding:"0.85rem",fontSize:"0.88rem",fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.05)",lineHeight:"1.6"}}
            />
          </div>

          <div style={{marginBottom:"1.5rem"}}>
            <label style={{fontWeight:"700",color:"#a78bfa",display:"block",marginBottom:"0.5rem"}}>
              Job Description <span style={{color:"rgba(255,255,255,0.35)",fontWeight:"400",fontSize:"0.85rem"}}>(Optional)</span>
            </label>
            <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={4}
              placeholder="Paste job description for a keyword match score..."
              style={{width:"100%",border:"2px solid rgba(167,139,250,0.3)",borderRadius:"10px",padding:"0.85rem",fontSize:"0.88rem",fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.05)",lineHeight:"1.6"}}
            />
          </div>

          {error && (
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"0.75rem 1rem",color:"#f87171",fontSize:"0.88rem",marginBottom:"1rem"}}>
              ?? {error}
            </div>
          )}

          <button onClick={()=>handleCheck()} disabled={loading}
            style={{width:"100%",padding:"0.9rem",borderRadius:"10px",border:"none",background:loading?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"white",fontWeight:"700",fontSize:"1rem",cursor:loading?"not-allowed":"pointer"}}>
            {loading ? "? Analyzing your resume..." : "?? Check ATS Score"}
          </button>
        </div>

        {result && (
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",backdropFilter:"blur(20px)",padding:"2rem",marginTop:"1.5rem",boxShadow:"0 25px 50px rgba(0,0,0,0.4)"}}>
            <h2 style={{fontWeight:"800",color:"white",marginBottom:"1.5rem",fontSize:"1.3rem"}}>?? Your ATS Analysis</h2>
            <div style={{display:"flex",gap:"2rem",flexWrap:"wrap",alignItems:"flex-start",marginBottom:"2rem"}}>
              <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"1.5rem 2rem"}}>
                <div style={{fontSize:"0.8rem",fontWeight:"700",color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em"}}>OVERALL ATS SCORE</div>
                <ScoreRing score={result.score}/>
              </div>
              <div style={{flex:"1 1 260px"}}>
                <div style={{fontWeight:"700",color:"rgba(255,255,255,0.8)",marginBottom:"1rem"}}>Score Breakdown</div>
                {result.breakdown && Object.entries(result.breakdown).map(([key,val])=>(
                  <ScoreBar key={key} label={key.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())} value={val.score} max={val.max}/>
                ))}
              </div>
            </div>
            {result.tips && result.tips.length > 0 && (
              <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:"10px",padding:"1.25rem",marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:"#fbbf24",marginBottom:"0.75rem"}}>?? Tips to Improve Your Score</div>
                <ul style={{margin:0,paddingLeft:"1.25rem",color:"rgba(255,255,255,0.7)",fontSize:"0.88rem",lineHeight:"1.9"}}>
                  {result.tips.map((tip,i)=><li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            {result.job_match_score !== undefined && (
              <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:"10px",padding:"1.25rem"}}>
                <div style={{fontWeight:"700",color:"#4ade80"}}>?? Job Match: {result.job_match_score}/100</div>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",margin:"0.4rem 0 0"}}>
                  {result.job_match_score>=70?"Great match! Your resume aligns well with this job.":result.job_match_score>=50?"Moderate match. Add more keywords from the job description.":"Low match. Tailor your resume with more relevant skills and keywords."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
