from fastapi import APIRouter

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/")
def get_jobs():

    jobs = [
        "Software Engineer",
        "Data Scientist",
        "Frontend Developer",
        "Backend Developer",
        "AI Engineer"
    ]

    return jobs