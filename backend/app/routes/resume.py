from fastapi import APIRouter
import anthropic
import os

router = APIRouter()

@router.post("/api/generate-resume")
async def generate_resume(data: dict):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    prompt = f"""Create a professional resume for:
Name: {data.get("name")}
Email: {data.get("email")}
Phone: {data.get("phone")}
LinkedIn: {data.get("linkedin")}
Education: {data.get("education")}
Skills: {data.get("skills")}
Projects: {data.get("projects")}
Certifications: {data.get("certifications")}
Experience: {data.get("experience")}

Generate a complete professional resume in HTML format."""

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return {"resume_html": message.content[0].text}