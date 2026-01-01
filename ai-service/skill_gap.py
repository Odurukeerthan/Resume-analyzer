from skill_extractor import extract_skills

def skill_gap_analysis(resume_text, job_text):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)
    return {
        "matched_skills": list(resume_skills & job_skills),
        "missing_skills": list(job_skills - resume_skills)
    }