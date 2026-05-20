from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os, json, urllib.request, urllib.error, logging, traceback

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    key = os.environ.get("OPENROUTER_API_KEY", "")
    return {"status": "ok", "key_set": bool(key)}

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("OPENROUTER_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "OPENROUTER_API_KEY not set"}, status_code=500)

        template = data.get("template", "modern")
        prompt = (
            "You are a resume designer. Create a " + template.upper() + " resume in pure HTML with inline styles only. "
            "No markdown, no backticks, no explanation. Return ONLY raw HTML starting with <div. "
            "Name: " + str(data.get("name","")) +
            ", Email: " + str(data.get("email","")) +
            ", Phone: " + str(data.get("phone","")) +
            ", Education: " + str(data.get("education","")) +
            ", Skills: " + str(data.get("skills","")) +
            ", Experience: " + str(data.get("experience","")) +
            ", Projects: " + str(data.get("projects","")) +
            ", Certifications: " + str(data.get("certifications",""))
        )

        MODELS = [
            "openai/gpt-oss-20b:free",
            "deepseek/deepseek-v4-flash:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "nvidia/nemotron-3-super-120b-a12b:free",
            "z-ai/glm-4.5-air:free",
            "qwen/qwen3-coder:free",
        ]

        errors = []
        for model in MODELS:
            try:
                logger.info("Trying: " + model)
                payload = json.dumps({
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 2000
                }).encode("utf-8")

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
                with urllib.request.urlopen(req, timeout=60) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    text = result["choices"][0]["message"]["content"]
                    text = text.replace("```html","").replace("```","").strip()
                    idx = text.find("<")
                    if idx > 0:
                        text = text[idx:]
                    logger.info("Success: " + model)
                    return {"resume_html": text, "model_used": model, "template": template}

            except urllib.error.HTTPError as e:
                err = e.read().decode("utf-8")
                logger.error("HTTPError " + model + ": " + err)
                errors.append(model + ": " + err)
                continue
            except Exception as e:
                logger.error("Error " + model + ": " + str(e))
                errors.append(model + ": " + str(e))
                continue

        return JSONResponse({"error": "All models failed", "details": errors}, status_code=500)

    except Exception as e:
        logger.error("Fatal: " + traceback.format_exc())
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)
