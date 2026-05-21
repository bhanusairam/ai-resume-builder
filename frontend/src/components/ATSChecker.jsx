import { useState } from "react";

const BACKEND = "https://resume-backend-eck9.onrender.com";

// ── Score ring animation ──────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#22c55e" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  const label =
    score >= 75 ? "Great" :
    score >= 50 ? "Average" :
    "Needs Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg width={radius * 2} height={radius * 2} style={{ transform: "rotate(-90deg)" }}>
        {/* background track */}
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke="#e5e7eb" strokeWidth={stroke}
        />
        {/* progress arc */}
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        {/* score text in center */}
        <text
          x={radius} y={radius + 2}
          textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="28" fontWeight="800"
          style={{ transform: "rotate(90deg)", transformOrigin: `${radius}px ${radius}px` }}
        >
          {score}
        </text>
        <text
          x={radius} y={radius + 26}
          textAnchor="middle" dominantBaseline="middle"
          fill="#6b7280" fontSize="11"
          style={{ transform: "rotate(90deg)", transformOrigin: `${radius}px ${radius}px` }}
        >
          / 100
        </text>
      </svg>
      <span style={{
        padding: "0.25rem 1rem", borderRadius: "999px", fontSize: "0.85rem",
        fontWeight: "700", background: color + "22", color
      }}>{label}</span>
    </div>
  );
}

// ── Bar for each category ─────────────────────────────────────────
function ScoreBar({ label, value, max = 100 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.87rem", color: "#374151", fontWeight: "600" }}>{label}</span>
        <span style={{ fontSize: "0.87rem", color, fontWeight: "700" }}>{value}/{max}</span>
      </div>
      <div style={{ height: "8px", borderRadius: "999px", background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color,
          borderRadius: "999px", transition: "width 1s ease"
        }} />
      </div>
    </div>
  );
}

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${BACKEND}/api/ats-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText, job_description: jobDesc })
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "3rem" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2e75b6 100%)",
        padding: "2.5rem 1rem 2rem", textAlign: "center", color: "#fff"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,255,255,0.15)", borderRadius: "999px",
          padding: "0.3rem 0.9rem", fontSize: "0.78rem", fontWeight: "700",
          letterSpacing: "0.08em", marginBottom: "1rem"
        }}>
          <span style={{ fontSize: "1rem" }}>🎯</span> ATS SCORE CHECKER
        </div>
        <h1 style={{ fontWeight: "800", fontSize: "2rem", margin: "0 0 0.5rem" }}>
          Beat the Applicant Tracking System
        </h1>
        <p style={{ opacity: 0.8, fontSize: "1rem", maxWidth: "520px", margin: "0 auto" }}>
          Paste your resume and get an instant ATS score out of 100.
          Optionally add a job description for a targeted match score.
        </p>
      </div>

      {/* ── Main card ── */}
      <div style={{ maxWidth: "860px", margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "2rem"
        }}>

          {/* Resume input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", color: "#1e3a5f", display: "block", marginBottom: "0.5rem" }}>
              📄 Your Resume Text <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Copy all text from your resume and paste it here (plain text, no formatting needed).
            </p>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={10}
              placeholder="Paste your full resume text here...

Example:
John Doe
john@email.com | 9999999999

EDUCATION
B.Tech Computer Science, XYZ University, 2024

SKILLS
Python, JavaScript, React, Django, SQL, Machine Learning

PROJECTS
ResumeAI - Built an AI-powered resume generator using FastAPI and React..."
              style={{
                width: "100%", border: "2px solid #e5e7eb", borderRadius: "10px",
                padding: "0.85rem", fontSize: "0.88rem", fontFamily: "inherit",
                resize: "vertical", outline: "none", transition: "border 0.2s",
                boxSizing: "border-box", color: "#374151", lineHeight: "1.6"
              }}
              onFocus={e => e.target.style.border = "2px solid #2e75b6"}
              onBlur={e => e.target.style.border = "2px solid #e5e7eb"}
            />
          </div>

          {/* Job description input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", color: "#1e3a5f", display: "block", marginBottom: "0.5rem" }}>
              💼 Job Description <span style={{ color: "#9ca3af", fontWeight: "400" }}>(Optional — for targeted match)</span>
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={5}
              placeholder="Paste the job description here to get a keyword match score...

Example:
We are looking for a Software Engineer with experience in Python, Django, REST APIs, and React. Must have strong problem-solving skills and experience with databases..."
              style={{
                width: "100%", border: "2px solid #e5e7eb", borderRadius: "10px",
                padding: "0.85rem", fontSize: "0.88rem", fontFamily: "inherit",
                resize: "vertical", outline: "none", transition: "border 0.2s",
                boxSizing: "border-box", color: "#374151", lineHeight: "1.6"
              }}
              onFocus={e => e.target.style.border = "2px solid #2e75b6"}
              onBlur={e => e.target.style.border = "2px solid #e5e7eb"}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px",
              padding: "0.75rem 1rem", color: "#dc2626", fontSize: "0.88rem",
              marginBottom: "1rem"
            }}>⚠️ {error}</div>
          )}

          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              width: "100%", padding: "0.9rem", borderRadius: "10px", border: "none",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #1e3a5f, #2e75b6)",
              color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s", letterSpacing: "0.02em"
            }}
          >
            {loading ? (
              <span>⏳ Analyzing your resume...</span>
            ) : (
              <span>🎯 Check ATS Score</span>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div style={{
            background: "#fff", borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "2rem", marginTop: "1.5rem",
            animation: "fadeIn 0.5s ease"
          }}>
            <h2 style={{ fontWeight: "800", color: "#1e3a5f", marginBottom: "1.5rem", fontSize: "1.3rem" }}>
              📊 Your ATS Analysis
            </h2>

            {/* Score ring + breakdown side by side */}
            <div style={{
              display: "flex", gap: "2rem", flexWrap: "wrap",
              alignItems: "flex-start", marginBottom: "2rem"
            }}>
              {/* Ring */}
              <div style={{
                flex: "0 0 auto", display: "flex", flexDirection: "column",
                alignItems: "center", gap: "0.75rem",
                background: "#f8fafc", borderRadius: "12px", padding: "1.5rem 2rem"
              }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", letterSpacing: "0.08em" }}>
                  OVERALL ATS SCORE
                </div>
                <ScoreRing score={result.score} />
              </div>

              {/* Breakdown bars */}
              <div style={{ flex: "1 1 260px" }}>
                <div style={{ fontWeight: "700", color: "#1e3a5f", marginBottom: "1rem", fontSize: "0.95rem" }}>
                  Score Breakdown
                </div>
                {result.breakdown && Object.entries(result.breakdown).map(([key, val]) => (
                  <ScoreBar
                    key={key}
                    label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    value={val.score}
                    max={val.max}
                  />
                ))}
              </div>
            </div>

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <div style={{
                background: "#fffbeb", border: "1px solid #fcd34d",
                borderRadius: "10px", padding: "1.25rem"
              }}>
                <div style={{ fontWeight: "700", color: "#92400e", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
                  💡 Quick Tips to Improve Your Score
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#78350f", fontSize: "0.88rem", lineHeight: "1.8" }}>
                  {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}

            {/* Job match */}
            {result.job_match_score !== undefined && (
              <div style={{
                background: "#f0fdf4", border: "1px solid #86efac",
                borderRadius: "10px", padding: "1.25rem", marginTop: "1rem"
              }}>
                <div style={{ fontWeight: "700", color: "#15803d", fontSize: "0.95rem" }}>
                  🎯 Job Description Match: {result.job_match_score}/100
                </div>
                <p style={{ color: "#166534", fontSize: "0.85rem", margin: "0.4rem 0 0" }}>
                  {result.job_match_score >= 70
                    ? "Great match! Your resume aligns well with this job."
                    : result.job_match_score >= 50
                    ? "Moderate match. Try adding more keywords from the job description."
                    : "Low match. Consider tailoring your resume to include more relevant skills and keywords."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem", marginTop: "2rem"
        }}>
          {[
            { icon: "📋", title: "Paste Resume", desc: "Copy text from your resume — no file upload needed" },
            { icon: "🤖", title: "AI Analysis", desc: "Our AI checks formatting, keywords, sections & structure" },
            { icon: "📊", title: "Get Score", desc: "Receive a 0–100 ATS score with a detailed breakdown" },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "#fff", borderRadius: "12px", padding: "1.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center"
            }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{icon}</div>
              <div style={{ fontWeight: "700", color: "#1e3a5f", marginBottom: "0.3rem" }}>{title}</div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: "1.5" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
