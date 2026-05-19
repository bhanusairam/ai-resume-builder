from fastapi import APIRouter
from fastapi.responses import JSONResponse
import anthropic
import os

router = APIRouter()

@router.post("/api/generate-resume")
async def generate_resume(data: dict):
    try:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return JSONResponse({"error": "API key missing"}, status_code=500)
        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"""Create a professional resume in HTML format for:
Name: {data.get("name", "")}
Email: {data.get("email", "")}
Phone: {data.get("phone", "")}
Education: {data.get("education", "")}
Skills: {data.get("skills", "")}
Projects: {data.get("projects", "")}
Experience: {data.get("experience", "")}"""
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"resume_html": message.content[0].text}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)