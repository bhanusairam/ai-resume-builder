from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os, json, urllib.request, urllib.error, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    return {"status": "ok", "key_set": bool(os.environ.get("OPENROUTER_API_KEY", ""))}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("OPENROUTER_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "OPENROUTER_API_KEY not set"}, status_code=500)
        
        prompt = "Write a professional resume in clean HTML with inline styles only. No markdown, no backticks, only pure HTML. For: Name: " + str(data.get("name","")) + ", Email: " + str(data.get("email","")) + ", Phone: " + str(data.get("phone","")) + ", LinkedIn: " + str(data.get("linkedin","")) + ", Education: " + str(data.get("education","")) + ", Skills: " + str(data.get("skills","")) + ", Experience: " + str(data.get("experience","")) + ", Projects: " + str(data.get("projects","")) + ", Certifications: " + str(data.get("certifications",""))
        
        models = [
            "google/gemma-3-4b-it:free",
            "google/gemma-3-1b-it:free",
            "mistralai/mistral-7b-instruct:free",
            "qwen/qwen-2-7b-instruct:free"
        ]
        
        last_error = ""
        for model in models:
            try:
                logger.info("Trying model: " + model)
                payload = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 2000}).encode("utf-8")
                req = urllib.request.Request(
                    "https://openrouter.ai/api/v1/chat/completions",
                    data=payload,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + api_key,
                        "HTTP-Referer": "https://ai-resume-builder-psi-kohl.vercel.app",
                        "X-Title": "ResumeAI"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=30) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    text = result["choices"][0]["message"]["content"]
                    text = text.replace("```html","").replace("```","").strip()
                    logger.info("Success with model: " + model)
                    return {"resume_html": text}
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8")
                last_error = body
                logger.error("Model " + model + " failed: " + body)
                continue
            except Exception as e:
                last_error = str(e)
                logger.error("Model " + model + " error: " + str(e))
                continue
        
        return JSONResponse({"error": "All models failed", "last_error": last_error}, status_code=500)
    except Exception as e:
        import traceback
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)