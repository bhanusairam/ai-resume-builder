import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";

function App() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResume(data);
    } catch (err) {
      alert("Error generating resume. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2563eb" }}>🎓 AI Resume Builder</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Generate a professional resume with AI</p>
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={{ flex: 1 }}>
          <ResumeForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div style={{ flex: 1 }}>
          {resume && <ResumePreview resume={resume} />}
        </div>
      </div>
    </div>
  );
}

export default App;