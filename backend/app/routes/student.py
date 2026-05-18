from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import Student
from app.schemas.student_schema import StudentProfile

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/profile")
def save_student_profile(
    student: StudentProfile,
    db: Session = Depends(get_db)
):
    new_student = Student(
        full_name=student.full_name,
        email=student.email,
        education=student.education,
        skills=student.skills,
        experience=student.experience,
        projects=student.projects,
        target_job=student.target_job
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Student profile saved",
        "student_id": new_student.id
    }