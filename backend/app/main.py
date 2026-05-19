from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import anthropic
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
    return {"status": "ok"}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return JSONResponse({"error": "API key missing"}, status_code=500)
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": f"""Make a professional HTML resume with inline styles for:
Name: {data.get("name","")}
Email: {data.get("email","")}
Phone: {data.get("phone","")}
Education: {data.get("education","")}
Skills: {data.get("skills","")}
Projects: {data.get("projects","")}
Experience: {data.get("experience","")}"""}]
        )
        return {"resume_html": message.content[0].text}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)