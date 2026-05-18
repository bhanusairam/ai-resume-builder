def skill_gap_analysis(user_skills, job_skills):
    user_set = set(user_skills.lower().split(","))
    job_set = set(job_skills.lower().split(","))

    matched = user_set.intersection(job_set)
    missing = job_set - user_set

    return {
        "matched": list(matched),
        "missing": list(missing)
    }