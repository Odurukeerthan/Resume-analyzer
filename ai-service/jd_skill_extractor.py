from skill_extractor import extract_skills

def extract_jd_skills(job_description):
    jd_skills = extract_skills(job_description)

    # flatten dict → set
    flat_skills = set()
    for skills in jd_skills.values():
        flat_skills.update(skills)

    return flat_skills
