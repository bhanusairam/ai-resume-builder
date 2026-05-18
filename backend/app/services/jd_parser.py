from app.services.ai_engine import parse_job_description

async def parse_jd(jd_text: str) -> dict:
    return await parse_job_description(jd_text)