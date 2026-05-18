from fastapi import APIRouter

router = APIRouter(
    prefix="/version",
    tags=["Version"]
)


@router.get("/")
def get_versions():

    return {
        "versions": [
            "Resume V1",
            "Resume V2",
            "Resume V3"
        ]
    }