import fitz
import sys
import json

from skill_extractor import extract_skills
from job_matcher import match_resume_to_job
from jd_skill_extractor import extract_jd_skills
from final_matcher import final_job_fit_score
from spacy_jd_keywords import extract_dynamic_jd_keywords


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


if __name__ == "__main__":
    pdf_path = sys.argv[1]

    # ---- RESUME ----
    resume_text = extract_text_from_pdf(pdf_path)
    resume_skills = extract_skills(resume_text)

    # ---- JOB DESCRIPTION (TEMP – backend will send later) ----
    job_role = "MERN Stack Developer"
    job_description = """
    We are hiring a MERN Stack Developer with strong experience in React.js,
    Node.js, Express.js, MongoDB, REST APIs, JavaScript, HTML, CSS, and Git.
    Knowledge of Python and machine learning is a plus.
    """

    jd_skills = extract_jd_skills(job_description)

    # ---- SKILL GAP (STATIC) ----
    matched_skills = resume_skills & jd_skills
    missing_skills = jd_skills - resume_skills

    # ---- TF-IDF (SKILLS ONLY) ----
    tfidf_score = match_resume_to_job(
        " ".join(resume_skills),
        " ".join(jd_skills)
    )

    final_score = final_job_fit_score(matched_skills, jd_skills, tfidf_score)

    # ---- OPTIONAL spaCy JD KEYWORDS (backend may use later) ----
    dynamic_jd_keywords = extract_dynamic_jd_keywords(job_description)
    dynamic_missing = dynamic_jd_keywords - resume_skills

    # ---- FINAL JSON OUTPUT (ONLY OUTPUT) ----
    result = {
        "jobRole": job_role,
        "finalScore": round(final_score, 2),
        "matchedSkills": sorted(list(matched_skills)),
        "missingSkills": sorted(list(missing_skills)),
        "dynamicMissingKeywords": sorted(list(dynamic_missing))
    }

    print(json.dumps(result))
