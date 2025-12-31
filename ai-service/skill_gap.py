from skill_extractor import extract_skills

def skill_gap_analysis(resume_text,job_text):
    resume_skills=extract_skills(resume_text)
    job_skills=extract_skills(job_text)
    resume_flat=set(sum(resume_skills.values(),[]))
    job_flat=set(sum(job_skills.values(),[]))
    
    matched=list(resume_flat & job_flat)
    missing = list(job_flat - resume_flat)

    return{
        "matched_skills":matched,
        "missing_skills":missing
    }