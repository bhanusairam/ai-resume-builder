from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os, json, urllib.request, urllib.error, logging, traceback
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from app.models import StudentProfile, ResumeVersion

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
            "google/gemma-3-27b-it:free",
            "mistralai/mistral-7b-instruct:free",
            "qwen/qwen3-8b:free",
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

                    try:
                        profile = StudentProfile.objects.create(
                            name=data.get("name", ""),
                            email=data.get("email", ""),
                            phone=data.get("phone", ""),
                            skills=str(data.get("skills", "")),
                            education=str(data.get("education", "")),
                            projects=str(data.get("projects", ""))
                        )
                        ResumeVersion.objects.create(
                            profile=profile,
                            content=text
                        )
                        logger.info("Resume saved for: " + data.get("name", ""))
                    except Exception as db_error:
                        logger.error("DB save error: " + str(db_error))

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

@app.get("/api/resumes")
def get_all_resumes():
    try:
        profiles = StudentProfile.objects.prefetch_related("resumeversion_set").all()
        result = []
        for profile in profiles:
            for rv in profile.resumeversion_set.all():
                result.append({
                    "id": rv.id,
                    "name": profile.name,
                    "email": profile.email,
                    "phone": profile.phone,
                    "created_at": str(rv.created_at),
                })
        return {"resumes": result}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
