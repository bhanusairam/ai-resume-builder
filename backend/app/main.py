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

TEMPLATE_PROMPTS = {
    "modern": "Create a MODERN resume in pure HTML with inline styles. Clean white background, left accent bar in #6366f1, name in bold 28px dark gray, section headers with bottom border in indigo, two-column layout 70/30. font-family: Segoe UI, sans-serif.",
    "classic": "Create a CLASSIC resume in pure HTML with inline styles. White background, centered name in 26px Georgia serif, thin horizontal rule below name, all-caps section headers, single-column layout, black text. font-family: Georgia, serif.",
    "sidebar": "Create a SIDEBAR resume in pure HTML with inline styles. Two columns: left sidebar 280px dark background #1e293b white text with name/contact/skills, right main area white with experience/education/projects. font-family: Segoe UI.",
    "minimal": "Create a MINIMAL resume in pure HTML with inline styles. Pure white, maximum whitespace, name in 32px light weight #111, thin gray dividers, no boxes, all text in shades of gray. font-family: Helvetica Neue.",
    "executive": "Create an EXECUTIVE resume in pure HTML with inline styles. Cream background #fdfaf6, dark navy header #0f172a full width with name in gold #c9a84c, elegant serif headings, gold accent lines between sections. Georgia serif headings, Segoe UI body.",
    "creative": "Create a CREATIVE resume in pure HTML with inline styles. Light gray background #f8fafc, large rose left border 6px solid #f43f5e, name in 30px bold with rose underline, skill tags as colored pill badges, section icons using unicode emoji. font-family: Segoe UI."
}

def build_prompt(data, template):
    style = TEMPLATE_PROMPTS.get(template, TEMPLATE_PROMPTS["modern"])
    return (
        "You are a resume designer. " + style + "\n"
        "No markdown, no backticks, only pure HTML starting with <div>. Return ONLY the HTML.\n\n"
        "Name: " + str(data.get("name","")) +
        "\nEmail: " + str(data.get("email","")) +
        "\nPhone: " + str(data.get("phone","")) +
        "\nLinkedIn: " + str(data.get("linkedin","")) +
        "\nEducation: " + str(data.get("education","")) +
        "\nSkills: " + str(data.get("skills","")) +
        "\nExperience: " + str(data.get("experience","")) +
        "\nProjects: " + str(data.get("projects","")) +
        "\nCertifications: " + str(data.get("certifications",""))
    )

MODELS = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-2-9b-it:free",
]

@app.post("/api/generate-resume")
async def generate_resume(request: Request):
    try:
        data = await request.json()
        api_key = os.environ.get("OPENROUTER_API_KEY", "")
        if not api_key:
            return JSONResponse({"error": "OPENROUTER_API_KEY not set"}, status_code=500)
        template = data.get("template", "modern")
        prompt = build_prompt(data, template)
        last_error = ""
        for model in MODELS:
            try:
                logger.info("Trying: " + model)
                payload = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 3000}).encode("utf-8")
                req = urllib.request.Request(
                    "https://openrouter.ai/api/v1/chat/completions",
                    data=payload,
                    headers={"Content-Type": "application/json", "Authorization": "Bearer " + api_key, "HTTP-Referer": "https://resume-ai-v1.vercel.app", "X-Title": "ResumeAI"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=45) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    text = result["choices"][0]["message"]["content"]
                    text = text.replace("```html","").replace("```","").strip()
                    if not text.startswith("<"):
                        idx = text.find("<div")
                        if idx != -1:
                            text = text[idx:]
                    return {"resume_html": text, "model_used": model, "template": template}
            except urllib.error.HTTPError as e:
                last_error = e.read().decode("utf-8")
                logger.error("Failed " + model + ": " + last_error)
                continue
            except Exception as e:
                last_error = str(e)
                continue
        return JSONResponse({"error": "All models failed", "last_error": last_error}, status_code=500)
    except Exception as e:
        import traceback
        return JSONResponse({"error": str(e), "trace": traceback.format_exc()}, status_code=500)