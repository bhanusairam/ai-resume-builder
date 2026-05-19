import React from "react";

function ResumePreview({ resume }) {
  return (
    <div style={{ background: "white", padding: "30px", borderRadius: "10px", border: "1px solid #ddd", whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", lineHeight: "1.6" }}>
      <h2 style={{ color: "#2563eb", borderBottom: "2px solid #2563eb", paddingBottom: "10px" }}>📄 Generated Resume</h2>
      <div dangerouslySetInnerHTML={{ __html: resume.resume_html || resume.resume || JSON.stringify(resume) }} />
    </div>
  );
}

export default ResumePreview;