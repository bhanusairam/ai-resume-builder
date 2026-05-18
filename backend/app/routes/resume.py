from fastapi import APIRouter

router = APIRouter()

@router.post("/generate")
def generate_resume(data: dict):
    return {
        "message": "Resume generated successfully",
        "resume": {
            "name": data.get("full_name"),
            "job_role": data.get("target_job"),
            "skills": data.get("skills"),
            "experience": data.get("experience"),
            "projects": data.get("projects")
        }
    }