from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import json
import urllib.request

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
    return {"status": "ok", "key_set": bool(key)}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "API key not set"}, status_code=500)
        prompt = "Write a professional resume in HTML with inline styles for: Name: " + str(data.get("name","")) + " Email: " + str(data.get("email","")) + " Phone: " + str(data.get("phone","")) + " Skills: " + str(data.get("skills","")) + " Education: " + str(data.get("education","")) + " Experience: " + str(data.get("experience","")) + " Projects: " + str(data.get("projects","")) + " Certifications: " + str(data.get("certifications",""))
        payload = json.dumps({"model": "claude-haiku-4-5-20251001","max_tokens": 2000,"messages": [{"role": "user", "content": prompt}]}).encode("utf-8")
        req = urllib.request.Request("https://api.anthropic.com/v1/messages",data=payload,headers={"Content-Type": "application/json","x-api-key": api_key,"anthropic-version": "2023-06-01"},method="POST")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            return {"resume_html": result["content"][0]["text"]}
    except Exception as e:
        import traceback
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)