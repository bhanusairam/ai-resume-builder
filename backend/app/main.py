from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os

app = FastAPI()

@app.middleware("http")
async def add_cors(request, call_next):
    if request.method == "OPTIONS":
        res = JSONResponse({})
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        res.headers["Access-Control-Allow-Headers"] = "*"
        return res
    res = await call_next(request)
    res.headers["Access-Control-Allow-Origin"] = "*"
    return res

@app.get("/")
def root():
    return {"status": "ok", "key_set": bool(os.environ.get("ANTHROPIC_API_KEY"))}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return JSONResponse({"error": "ANTHROPIC_API_KEY not set"}, status_code=500)
        
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        
        name = data.get("name", "")
        email = data.get("email", "")
        phone = data.get("phone", "")
        linkedin = data.get("linkedin", "")
        education = data.get("education", "")
        skills = data.get("skills", "")
        projects = data.get("projects", "")
        certifications = data.get("certifications", "")
        experience = data.get("experience", "")
        
        prompt = "Create a professional resume in clean HTML with inline styles only. No external CSS. For: Name: " + name + ", Email: " + email + ", Phone: " + phone + ", LinkedIn: " + linkedin + ", Education: " + education + ", Skills: " + skills + ", Projects: " + projects + ", Certifications: " + certifications + ", Experience: " + experience

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"resume_html": message.content[0].text}
    except Exception as e:
        return JSONResponse({"error": str(e), "type": type(e).__name__}, status_code=500)