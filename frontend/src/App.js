import React, { useState } from "react";

const TEMPLATES = [
  { id: "modern",    name: "Modern",    emoji: "⚡", color: "#6366f1", desc: "Indigo accent" },
  { id: "classic",   name: "Classic",   emoji: "📜", color: "#92400e", desc: "Traditional serif" },
  { id: "sidebar",   name: "Sidebar",   emoji: "🗂️", color: "#0f766e", desc: "Dark side panel" },
  { id: "minimal",   name: "Minimal",   emoji: "◻️", color: "#374151", desc: "Ultra clean" },
  { id: "executive", name: "Executive", emoji: "👔", color: "#b45309", desc: "Navy & gold" },
  { id: "creative",  name: "Creative",  emoji: "🎨", color: "#e11d48", desc: "Bold & fun" },
  { id: "techDark",  name: "Tech Dark", emoji: "💻", color: "#3fb950", desc: "GitHub dark" },
  { id: "corporate", name: "Corporate", emoji: "🏢", color: "#2563eb", desc: "Classic blue" },
  { id: "elegant",   name: "Elegant",   emoji: "🌿", color: "#16a34a", desc: "Refined green" },
  { id: "mono",      name: "Mono",      emoji: "⌨️", color: "#111111", desc: "Developer style" },
];

const pills = (str, bg, col) => (str||"").split(",").map(s => `<span style="background:${bg};color:${col};padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600;display:inline-block;margin:2px">${s.trim()}</span>`).join("");

const TEMPLATE_HTML = {
  modern: (d) => `<div style="font-family:'Segoe UI',sans-serif;background:#fff;display:flex;min-height:700px"><div style="width:7px;background:#6366f1;flex-shrink:0"></div><div style="flex:1;padding:40px"><div style="border-bottom:3px solid #6366f1;padding-bottom:18px;margin-bottom:28px"><div style="font-size:30px;font-weight:800;color:#1e1b4b">${d.name}</div><div style="color:#6366f1;font-size:13px;margin-top:6px;font-weight:600">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</div></div><div style="display:grid;grid-template-columns:1fr 250px;gap:32px"><div><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:5px;margin-bottom:10px">Experience</div><div style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:24px;white-space:pre-line">${d.experience||"—"}</div><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:5px;margin-bottom:10px">Projects</div><div style="font-size:14px;color:#374151;line-height:1.7;white-space:pre-line">${d.projects||"—"}</div></div><div><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:5px;margin-bottom:10px">Education</div><div style="font-size:13px;color:#374151;line-height:1.6;margin-bottom:20px">${d.education||"—"}</div><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:5px;margin-bottom:10px">Skills</div><div style="margin-bottom:20px">${pills(d.skills||"—","#ede9fe","#6366f1")}</div><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#6366f1;text-transform:uppercase;border-bottom:2px solid #e0e7ff;padding-bottom:5px;margin-bottom:10px">Certifications</div><div style="font-size:13px;color:#374151;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div></div></div></div>`,

  classic: (d) => `<div style="font-family:Georgia,serif;background:#fff;padding:48px;min-height:700px"><div style="text-align:center;border-bottom:2px solid #1a1a1a;padding-bottom:18px;margin-bottom:28px"><div style="font-size:28px;font-weight:700;color:#1a1a1a;letter-spacing:2px;text-transform:uppercase">${d.name}</div><div style="font-size:12px;color:#555;font-family:'Segoe UI',sans-serif;margin-top:6px">${d.email}${d.phone?" | "+d.phone:""}${d.linkedin?" | "+d.linkedin:""}</div></div>${[["Education",d.education],["Experience",d.experience],["Skills",(d.skills||"").split(",").join(" · ")],["Projects",d.projects],["Certifications",d.certifications]].map(([l,v])=>`<div style="font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">${l}</div><div style="font-size:14px;color:#333;line-height:1.8;margin-bottom:22px;white-space:pre-line">${v||"—"}</div>`).join("")}</div>`,

  sidebar: (d) => `<div style="font-family:'Segoe UI',sans-serif;background:#fff;display:flex;min-height:700px"><div style="width:250px;background:#0f172a;color:#fff;padding:36px 22px;flex-shrink:0"><div style="font-size:21px;font-weight:800;color:#fff;margin-bottom:4px">${d.name}</div><div style="font-size:11px;color:#94a3b8;margin-bottom:3px">${d.email}</div><div style="font-size:11px;color:#94a3b8;margin-bottom:26px">${d.phone||""}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px">Skills</div><div style="margin-bottom:22px">${(d.skills||"").split(",").map(s=>`<span style="background:#1e293b;color:#a5b4fc;padding:2px 8px;border-radius:4px;font-size:11px;display:inline-block;margin:2px">${s.trim()}</span>`).join("")}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px">Education</div><div style="font-size:11px;color:#cbd5e1;line-height:1.6;margin-bottom:22px">${d.education||"—"}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px">Certifications</div><div style="font-size:11px;color:#cbd5e1;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div><div style="flex:1;padding:36px 30px;background:#f8fafc"><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0f172a;border-left:4px solid #6366f1;padding-left:10px;margin-bottom:12px">Experience</div><div style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:26px;white-space:pre-line">${d.experience||"—"}</div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0f172a;border-left:4px solid #6366f1;padding-left:10px;margin-bottom:12px">Projects</div><div style="font-size:14px;color:#374151;line-height:1.7;white-space:pre-line">${d.projects||"—"}</div></div></div>`,

  minimal: (d) => `<div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;padding:56px;min-height:700px"><div style="font-size:34px;font-weight:300;color:#111;letter-spacing:-1px;margin-bottom:4px">${d.name}</div><div style="font-size:12px;color:#aaa;letter-spacing:1px;margin-bottom:48px">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</div><div style="display:grid;grid-template-columns:120px 1fr;gap:18px 40px;align-items:start">${[["Education",d.education],["Experience",d.experience],["Skills",(d.skills||"").split(",").join(", ")],["Projects",d.projects],["Certifications",d.certifications]].map(([l,v])=>`<span style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#ccc;padding-top:3px">${l}</span><div style="font-size:14px;color:#333;line-height:1.8;white-space:pre-line">${v||"—"}</div>`).join("")}</div></div>`,

  executive: (d) => `<div style="font-family:Georgia,serif;background:#fdfaf6;min-height:700px"><div style="background:#0f172a;padding:38px 48px"><div style="font-size:30px;font-weight:700;color:#c9a84c;letter-spacing:2px;text-transform:uppercase">${d.name}</div><div style="font-size:12px;color:#94a3b8;font-family:'Segoe UI',sans-serif;margin-top:8px;letter-spacing:1px">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</div></div><div style="padding:38px 48px"><div style="border-top:2px solid #c9a84c;border-bottom:1px solid #e5d5b0;padding:6px 0;margin-bottom:26px"></div>${[["Education",d.education],["Professional Experience",d.experience],["Core Competencies",(d.skills||"").split(",").join(" · ")],["Key Projects",d.projects],["Certifications",d.certifications]].map(([l,v])=>`<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#92400e;margin-bottom:8px">${l}</div><div style="font-size:14px;color:#1a1a1a;line-height:1.8;margin-bottom:22px;white-space:pre-line">${v||"—"}</div>`).join("")}</div></div>`,

  creative: (d) => `<div style="font-family:'Segoe UI',sans-serif;background:#f8fafc;min-height:700px;border-left:8px solid #e11d48"><div style="padding:40px 40px 18px"><div style="font-size:32px;font-weight:900;color:#0f172a">${d.name}</div><div style="width:52px;height:4px;background:#e11d48;margin:10px 0"></div><div style="font-size:12px;color:#64748b">${d.email}${d.phone?" · "+d.phone:""}${d.linkedin?" · "+d.linkedin:""}</div></div><div style="padding:0 40px 40px;display:grid;grid-template-columns:1fr 220px;gap:20px"><div><div style="background:#fff;border-radius:10px;padding:22px;margin-bottom:14px;border:1px solid #f1f5f9"><div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin-bottom:10px">Experience</div><div style="font-size:14px;color:#334155;line-height:1.7;white-space:pre-line">${d.experience||"—"}</div></div><div style="background:#fff;border-radius:10px;padding:22px;border:1px solid #f1f5f9"><div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin-bottom:10px">Projects</div><div style="font-size:14px;color:#334155;line-height:1.7;white-space:pre-line">${d.projects||"—"}</div></div></div><div><div style="background:#fff;border-radius:10px;padding:16px;margin-bottom:12px;border:1px solid #f1f5f9"><div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin-bottom:8px">Education</div><div style="font-size:12px;color:#334155;line-height:1.6">${d.education||"—"}</div></div><div style="background:#fff;border-radius:10px;padding:16px;margin-bottom:12px;border:1px solid #f1f5f9"><div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin-bottom:8px">Skills</div><div>${pills(d.skills||"","#fff1f2","#e11d48")}</div></div><div style="background:#fff;border-radius:10px;padding:16px;border:1px solid #f1f5f9"><div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e11d48;margin-bottom:8px">Certifications</div><div style="font-size:12px;color:#334155;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div></div></div></div>`,

  techDark: (d) => `<div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#e6edf3;min-height:700px"><div style="background:#161b22;border-bottom:1px solid #30363d;padding:32px 36px;display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-size:24px;font-weight:700;color:#f0f6fc;margin-bottom:6px">${d.name}</div><div style="font-size:12px;color:#58a6ff">${d.email}${d.phone?" · "+d.phone:""}</div><div style="font-size:12px;color:#58a6ff;margin-top:2px">${d.linkedin||""}</div></div><span style="background:#1f6feb22;border:1px solid #1f6feb;color:#58a6ff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;height:fit-content">Open to Work</span></div><div style="padding:28px 36px;display:grid;grid-template-columns:1fr 200px;gap:28px"><div><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#3fb950;text-transform:uppercase;margin-bottom:10px">Experience</div><div style="font-size:13px;color:#c9d1d9;line-height:1.7;margin-bottom:22px;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:14px;white-space:pre-line">${d.experience||"—"}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#3fb950;text-transform:uppercase;margin-bottom:10px">Projects</div><div style="font-size:13px;color:#c9d1d9;line-height:1.7;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:14px;white-space:pre-line">${d.projects||"—"}</div></div><div><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#3fb950;text-transform:uppercase;margin-bottom:8px">Skills</div><div style="margin-bottom:18px">${(d.skills||"").split(",").map(s=>`<span style="background:#21262d;border:1px solid #30363d;color:#79c0ff;padding:2px 8px;border-radius:4px;font-size:11px;display:inline-block;margin:2px;font-family:monospace">${s.trim()}</span>`).join("")}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#3fb950;text-transform:uppercase;margin-bottom:8px">Education</div><div style="font-size:12px;color:#c9d1d9;line-height:1.6;margin-bottom:18px">${d.education||"—"}</div><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#3fb950;text-transform:uppercase;margin-bottom:8px">Certifications</div><div style="font-size:12px;color:#c9d1d9;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div></div></div>`,

  corporate: (d) => `<div style="font-family:'Segoe UI',sans-serif;background:#fff;min-height:700px"><div style="background:#1a3a5c;padding:30px 36px 26px"><div style="font-size:26px;font-weight:700;color:#fff;letter-spacing:0.5px;margin-bottom:8px">${d.name}</div><div style="display:flex;gap:18px;font-size:12px;color:#93c5fd;flex-wrap:wrap"><span>${d.email}</span>${d.phone?`<span>${d.phone}</span>`:""}<span>${d.linkedin||""}</span></div></div><div style="height:4px;background:#2563eb"></div><div style="padding:28px 36px;display:grid;grid-template-columns:1fr 190px;gap:28px"><div><div style="background:#eff6ff;border-left:3px solid #2563eb;padding:12px 16px;margin-bottom:18px"><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px">Professional Experience</div><div style="font-size:13px;color:#374151;line-height:1.7;white-space:pre-line">${d.experience||"—"}</div></div><div style="background:#eff6ff;border-left:3px solid #2563eb;padding:12px 16px"><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px">Key Projects</div><div style="font-size:13px;color:#374151;line-height:1.7;white-space:pre-line">${d.projects||"—"}</div></div></div><div><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px;margin-bottom:14px"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px">Education</div><div style="font-size:12px;color:#374151;line-height:1.6">${d.education||"—"}</div></div><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px;margin-bottom:14px"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px">Skills</div><div>${pills(d.skills||"","#dbeafe","#1e40af")}</div></div><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px">Certifications</div><div style="font-size:12px;color:#374151;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div></div></div></div>`,

  elegant: (d) => `<div style="font-family:Georgia,serif;background:#fafaf8;min-height:700px"><div style="padding:36px 40px;border-bottom:2px solid #166534"><div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="font-size:26px;font-weight:700;color:#14532d;margin-bottom:4px">${d.name}</div><div style="width:48px;height:2px;background:#16a34a;margin-bottom:8px"></div><div style="font-size:12px;color:#4b7c59;font-family:'Segoe UI',sans-serif">${d.email}${d.phone?" · "+d.phone:""}</div></div><div style="text-align:right;font-size:12px;color:#4b7c59;font-family:'Segoe UI',sans-serif">${d.linkedin||""}</div></div></div><div style="padding:28px 40px;display:grid;grid-template-columns:1fr 1fr;gap:28px"><div><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:14px;height:14px;background:#16a34a;border-radius:2px"></div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#14532d">Education</div></div><div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:22px">${d.education||"—"}</div><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:14px;height:14px;background:#16a34a;border-radius:2px"></div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#14532d">Skills</div></div><div style="margin-bottom:22px">${(d.skills||"").split(",").map(s=>`<div style="font-size:12px;color:#374151;padding:4px 0;border-bottom:0.5px solid #d1fae5;display:flex;align-items:center;gap:6px"><span style="color:#16a34a;font-weight:700">▸</span>${s.trim()}</div>`).join("")}</div><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:14px;height:14px;background:#16a34a;border-radius:2px"></div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#14532d">Certifications</div></div><div style="font-size:13px;color:#374151;line-height:1.6;white-space:pre-line">${d.certifications||"—"}</div></div><div><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:14px;height:14px;background:#16a34a;border-radius:2px"></div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#14532d">Experience</div></div><div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:22px;white-space:pre-line">${d.experience||"—"}</div><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:14px;height:14px;background:#16a34a;border-radius:2px"></div><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#14532d">Projects</div></div><div style="font-size:13px;color:#374151;line-height:1.7;white-space:pre-line">${d.projects||"—"}</div></div></div></div>`,

  mono: (d) => `<div style="font-family:'Courier New',monospace;background:#fff;min-height:700px;padding:36px"><div style="border:2px solid #111;padding:20px 24px;margin-bottom:24px"><div style="font-size:20px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:3px;margin-bottom:4px">${d.name}</div><div style="font-size:11px;color:#555;letter-spacing:1px">${d.email}${d.phone?" | "+d.phone:""}${d.linkedin?" | "+d.linkedin:""}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div><div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:10px">// Experience</div><div style="font-size:12px;color:#333;line-height:1.8;margin-bottom:20px;white-space:pre-line">${d.experience||"—"}</div><div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:10px">// Projects</div><div style="font-size:12px;color:#333;line-height:1.8;white-space:pre-line">${d.projects||"—"}</div></div><div><div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:10px">// Education</div><div style="font-size:12px;color:#333;line-height:1.8;margin-bottom:20px">${d.education||"—"}</div><div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:10px">// Skills</div><div style="margin-bottom:20px">${(d.skills||"").split(",").map(s=>`<span style="border:1px solid #111;color:#111;padding:2px 8px;font-size:10px;margin:2px;display:inline-block">[${s.trim()}]</span>`).join("")}</div><div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:10px">// Certifications</div><div style="font-size:12px;color:#333;line-height:1.8;white-space:pre-line">${d.certifications||"—"}</div></div></div></div>`,
};

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", phone:"", linkedin:"", education:"", skills:"", certifications:"", experience:"", projects:"" });
  const [template, setTemplate] = useState("modern");
  const [resume, setResume] = useState("");
  const update = (k,v) => setForm(f=>({...f,[k]:v}));

  const switchTemplate = (tpl) => {
    setTemplate(tpl);
    setResume(TEMPLATE_HTML[tpl](form));
  };

  const inp = (label, k, ph, multi) => (
    <div style={{marginBottom:18}}>
      <label style={{display:"block",color:"#94a3b8",fontSize:13,marginBottom:6,fontWeight:600}}>{label}</label>
      {multi
        ? <textarea value={form[k]} onChange={e=>update(k,e.target.value)} placeholder={ph} rows={3} style={{width:"100%",padding:"11px 14px",background:"#0f172a",border:"1px solid #334155",borderRadius:10,color:"#e2e8f0",fontSize:14,boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/>
        : <input value={form[k]} onChange={e=>update(k,e.target.value)} placeholder={ph} style={{width:"100%",padding:"11px 14px",background:"#0f172a",border:"1px solid #334155",borderRadius:10,color:"#e2e8f0",fontSize:14,boxSizing:"border-box"}}/>}
    </div>
  );

  const card = {background:"#111827",borderRadius:20,padding:"32px 36px",maxWidth:640,margin:"0 auto",boxShadow:"0 24px 64px rgba(0,0,0,.6)",border:"1px solid #1e293b"};
  const STEPS = ["Personal","Education","Experience","Template","Resume"];
  const backBtn = (to) => <button onClick={()=>setStep(to)} style={{padding:"11px 20px",fontWeight:600,fontSize:14,borderRadius:12,cursor:"pointer",border:"1px solid #334155",background:"transparent",color:"#94a3b8"}}>← Back</button>;
  const nextBtn = (to, disabled) => <button onClick={()=>setStep(to)} disabled={disabled} style={{padding:"11px 28px",fontWeight:700,fontSize:14,borderRadius:12,border:"none",background:disabled?"#334155":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:disabled?"#64748b":"#fff",cursor:disabled?"not-allowed":"pointer"}}>Next →</button>;

  return (
    <div style={{minHeight:"100vh",background:"#0a0a14",color:"#e2e8f0",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:"0 16px 60px"}}>
      <style>{`@media print{.noprint{display:none!important}}`}</style>

      <div className="noprint" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 8px 8px",maxWidth:960,margin:"0 auto"}}>
        <div>
          <div style={{fontSize:28,fontWeight:800,background:"linear-gradient(135deg,#818cf8,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ ResumeAI</div>
          <div style={{color:"#64748b",fontSize:12,marginTop:2}}>10 templates • Instant preview</div>
        </div>
        <a href="https://github.com/bhanusairam/ai-resume-builder" target="_blank" rel="noreferrer"
          style={{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:12,border:"1px solid #334155",background:"#111827",color:"#94a3b8",textDecoration:"none",fontSize:13,fontWeight:600}}>
          <GithubIcon /> GitHub
        </a>
      </div>

      {step < 4 && (
        <div className="noprint" style={{display:"flex",justifyContent:"center",alignItems:"flex-start",gap:0,margin:"20px 0 28px"}}>
          {STEPS.map((s,i) => (
            <React.Fragment key={i}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,background:i<step?"#6366f1":i===step?"#818cf8":"#1e293b",color:i<=step?"#fff":"#475569",border:i===step?"2px solid #a5b4fc":"2px solid transparent"}}>{i<step?"✓":i+1}</div>
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
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>{nextBtn(1,!form.name||!form.email)}</div>
      </div>}

      {step===1 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>🎓 Education & Skills</h2>
        {inp("Education *","education","B.Tech CSE, XYZ University, 2024, CGPA: 8.5",true)}
        {inp("Skills *","skills","Python, React, Node.js, SQL, AWS",true)}
        {inp("Certifications","certifications","AWS Cloud Practitioner (2024)",true)}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{backBtn(0)}{nextBtn(2,!form.education||!form.skills)}</div>
      </div>}

      {step===2 && <div style={card}>
        <h2 style={{color:"#818cf8",fontSize:20,marginTop:0,marginBottom:24}}>💼 Experience & Projects</h2>
        {inp("Work Experience","experience","Software Intern @ ABC Corp (Jun–Aug 2023): Built REST APIs",true)}
        {inp("Projects","projects","E-Commerce Platform: React + Node.js + MongoDB, 500+ users",true)}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>{backBtn(1)}{nextBtn(3)}</div>
      </div>}

      {step===3 && (
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <h2 style={{color:"#fff",fontSize:24,margin:"0 0 8px",fontWeight:800}}>🎨 Choose Your Template</h2>
            <p style={{color:"#64748b",margin:0,fontSize:14}}>10 professional styles — click any to preview instantly</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:28}}>
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={()=>{switchTemplate(t.id);setStep(4);}}
                style={{background:"#111827",border:`2px solid ${template===t.id?t.color:"#1e293b"}`,borderRadius:16,padding:"20px 14px",cursor:"pointer",textAlign:"center",transition:"all .2s",boxShadow:template===t.id?`0 0 20px ${t.color}44`:"none"}}>
                <div style={{fontSize:32,marginBottom:10}}>{t.emoji}</div>
                <div style={{fontSize:13,fontWeight:800,color:t.color,marginBottom:4}}>{t.name}</div>
                <div style={{fontSize:11,color:"#475569",marginBottom:12}}>{t.desc}</div>
                <div style={{background:`${t.color}22`,border:`1px solid ${t.color}44`,borderRadius:8,padding:"7px 10px",color:t.color,fontSize:11,fontWeight:700}}>Select →</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>{backBtn(2)}</div>
        </div>
      )}

      {step===4 && (
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div className="noprint" style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{color:"#818cf8",margin:"0 0 4px",fontSize:20}}>✅ Your Resume</h2>
                <p style={{color:"#475569",margin:0,fontSize:13}}>Click any template below to switch instantly</p>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {backBtn(3)}
                <a href="https://github.com/bhanusairam/ai-resume-builder" target="_blank" rel="noreferrer"
                  style={{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:12,border:"1px solid #334155",background:"#111827",color:"#94a3b8",textDecoration:"none",fontSize:13,fontWeight:600}}><GithubIcon /> GitHub</a>
                <button onClick={()=>window.print()} style={{padding:"10px 22px",fontWeight:700,fontSize:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",cursor:"pointer"}}>🖨️ Print / PDF</button>
              </div>
            </div>
            <div style={{background:"#111827",borderRadius:16,padding:"14px 18px",border:"1px solid #1e293b",marginBottom:20}}>
              <p style={{color:"#64748b",fontSize:11,margin:"0 0 10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>Switch Template</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {TEMPLATES.map(t=>(
                  <button key={t.id} onClick={()=>switchTemplate(t.id)}
                    style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:20,border:`2px solid ${template===t.id?t.color:"#1e293b"}`,background:template===t.id?`${t.color}22`:"#0f172a",color:template===t.id?t.color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",boxShadow:template===t.id?`0 0 10px ${t.color}44`:"none"}}>
                    <span>{t.emoji}</span><span>{t.name}</span>
                    {template===t.id && <span style={{fontSize:9,background:t.color,color:"#fff",padding:"1px 5px",borderRadius:8}}>Active</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.7)"}} dangerouslySetInnerHTML={{__html:resume}}/>
          <div className="noprint" style={{textAlign:"center",marginTop:20,color:"#334155",fontSize:13}}>
            Built with ⚡ ResumeAI · <a href="https://github.com/bhanusairam/ai-resume-builder" target="_blank" rel="noreferrer" style={{color:"#6366f1",textDecoration:"none"}}>View Source on GitHub</a>
          </div>
        </div>
      )}
    </div>
  );
}