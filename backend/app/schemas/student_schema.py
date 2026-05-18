from pydantic import BaseModel

class StudentProfile(BaseModel):
    full_name: str
    email: str
    education: str
    skills: str
    experience: str
    projects: str
    target_job: str