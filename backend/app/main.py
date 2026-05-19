from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os, json, urllib.request, urllib.error

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
    return {"status": "ok", "key_set": bool(os.environ.get("GROQ_API_KEY", ""))}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("GROQ_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "GROQ_API_KEY not set"}, status_code=500)
        prompt = "Write a professional resume in clean HTML with inline styles only. No markdown, no backticks, only pure HTML. For: Name: " + str(data.get("name","")) + ", Email: " + str(data.get("email","")) + ", Phone: " + str(data.get("phone","")) + ", LinkedIn: " + str(data.get("linkedin","")) + ", Education: " + str(data.get("education","")) + ", Skills: " + str(data.get("skills","")) + ", Experience: " + str(data.get("experience","")) + ", Projects: " + str(data.get("projects","")) + ", Certifications: " + str(data.get("certifications",""))
        payload = json.dumps({"model": "llama3-8b-8192", "messages": [{"role": "user", "content": prompt}], "max_tokens": 2000}).encode("utf-8")
        req = urllib.request.Request("https://api.groq.com/openai/v1/chat/completions", data=payload, headers={"Content-Type": "application/json", "Authorization": "Bearer " + api_key}, method="POST")
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode("utf-8"))
                text = result["choices"][0]["message"]["content"]
                text = text.replace("```html","").replace("```","").strip()
                return {"resume_html": text}
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            return JSONResponse({"error": str(e), "body": body}, status_code=500)
    except Exception as e:
        import traceback
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)