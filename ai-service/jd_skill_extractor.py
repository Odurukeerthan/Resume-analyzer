from skill_extractor import extract_skills

def extract_jd_skills(job_description):
    # extract_skills now already returns a SET
    jd_skills = extract_skills(job_description)
    return jd_skills
