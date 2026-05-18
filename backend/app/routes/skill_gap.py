from fastapi import APIRouter

router = APIRouter(
    prefix="/skill-gap",
    tags=["Skill Gap"]
)


@router.post("/")
def skill_gap_analysis(data: dict):

    return {
        "missing_skills": [
            "Docker",
            "System Design",
            "AWS"
        ]
    }