from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.resume import router as resume_router

app = FastAPI()

origins = [
    "https://ai-resume-builder-psi-kohl.vercel.app",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(resume_router)

@app.get("/")
def root():
    return {"status": "ok"}