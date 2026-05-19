import React, { useState } from "react";

function ResumeForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", linkedin: "",
    education: "", skills: "", projects: "", certifications: "", experience: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" };
  const labelStyle = { fontWeight: "bold", display: "block", marginBottom: "4px" };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
      <h2 style={{ color: "#2563eb" }}>Your Details</h2>
      <label style={labelStyle}>Full Name</label>
      <input style={inputStyle} name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
      <label style={labelStyle}>Email</label>
      <input style={inputStyle} name="email" value={formData.email} onChange={handleChange} placeholder="john@email.com" required />
      <label style={labelStyle}>Phone</label>
      <input style={inputStyle} name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9999999999" />
      <label style={labelStyle}>LinkedIn URL</label>
      <input style={inputStyle} name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/john" />
      <label style={labelStyle}>Education</label>
      <textarea style={{...inputStyle, height: "80px"}} name="education" value={formData.education} onChange={handleChange} placeholder="B.Tech in CSE, XYZ University, 2024" />
      <label style={labelStyle}>Skills</label>
      <textarea style={{...inputStyle, height: "80px"}} name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, React, Node.js, SQL..." />
      <label style={labelStyle}>Projects</label>
      <textarea style={{...inputStyle, height: "80px"}} name="projects" value={formData.projects} onChange={handleChange} placeholder="Project name - description..." />
      <label style={labelStyle}>Certifications</label>
      <textarea style={{...inputStyle, height: "60px"}} name="certifications" value={formData.certifications} onChange={handleChange} placeholder="AWS Certified, Google Cloud..." />
      <label style={labelStyle}>Experience (if any)</label>
      <textarea style={{...inputStyle, height: "80px"}} name="experience" value={formData.experience} onChange={handleChange} placeholder="Intern at XYZ - worked on..." />
      <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#999" : "#2563eb", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "⏳ Generating..." : "🚀 Generate Resume"}
      </button>
    </form>
  );
}

export default ResumeForm;