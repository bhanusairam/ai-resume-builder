# This is already handled inside ai_engine.py → analyze_skill_gap()
# This file is a thin wrapper for future standalone use

from app.services.ai_engine import analyze_skill_gap

async def match_skills(student_skills, target_role, job_description=None, required_skills=None):
    return await analyze_skill_gap(student_skills, target_role, job_description, required_skills)