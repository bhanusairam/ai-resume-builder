from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

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
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    return {"status": "ok", "key_set": bool(key), "key_prefix": key[:10] if key else "none"}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "API key not set"}, status_code=500)
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        prompt = "Write a professional resume in HTML with inline styles for: Name: " + str(data.get("name","")) + " Email: " + str(data.get("email","")) + " Skills: " + str(data.get("skills","")) + " Education: " + str(data.get("education","")) + " Experience: " + str(data.get("experience","")) + " Projects: " + str(data.get("projects",""))
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"resume_html": message.content[0].text}
    except Exception as e:
        import traceback
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)