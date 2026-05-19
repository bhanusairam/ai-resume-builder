from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import anthropic
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/generate-resume")
async def generate_resume(data: dict):
    try:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return JSONResponse({"error": "API key missing"}, status_code=500)
        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"""Create a professional resume in clean HTML format for:
Name: {data.get("name", "")}
Email: {data.get("email", "")}
Phone: {data.get("phone", "")}
LinkedIn: {data.get("linkedin", "")}
Education: {data.get("education", "")}
Skills: {data.get("skills", "")}
Projects: {data.get("projects", "")}
Certifications: {data.get("certifications", "")}
Experience: {data.get("experience", "")}

Generate a complete professional resume with proper HTML formatting. Use inline styles only."""
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"resume_html": message.content[0].text}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)