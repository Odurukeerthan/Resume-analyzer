import fitz
import sys

from skill_extractor import extract_skills
from scorer import score_resume
from job_matcher import match_resume_to_job
from jd_skill_extractor import extract_jd_skills
from final_matcher import final_job_fit_score


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


if __name__ == "__main__":
    pdf_path = sys.argv[1]

    # ---- RESUME PROCESSING ----
    resume_text = extract_text_from_pdf(pdf_path)
    resume_skills_dict = extract_skills(resume_text)

    resume_skills = set()
    for skills in resume_skills_dict.values():
        resume_skills.update(skills)

    resume_score = score_resume(resume_skills_dict)

    # ---- JOB DESCRIPTION ----
    job_description = """We are hiring a MERN Stack Developer with strong experience in building full-stack web applications.
The ideal candidate should have hands-on experience with React.js for frontend development, Node.js and Express.js for backend development, and MongoDB for database management. You will be responsible for designing RESTful APIs, integrating frontend components with server-side logic, and ensuring application performance and scalability.
Required skills include JavaScript (ES6+), HTML, CSS, React.js, Node.js, Express.js, MongoDB, and Git. Familiarity with backend architecture, API design, and database operations is essential.
Knowledge of machine learning basics, Python programming, and experience working in collaborative development environments is a plus."""


    jd_skills = extract_jd_skills(job_description)

    # ---- SKILL GAP ----
    matched_skills = resume_skills & jd_skills
    missing_skills = jd_skills - resume_skills

    # ---- TF-IDF (SKILLS vs SKILLS) ----
    resume_skill_text = " ".join(resume_skills)
    jd_skill_text = " ".join(jd_skills)

    tfidf_score = match_resume_to_job(resume_skill_text, jd_skill_text)

    # ---- FINAL SCORE ----
    final_score = final_job_fit_score(matched_skills, jd_skills, tfidf_score)

    # ---- OUTPUT ----
    print("\n====== RESUME SCORE ======")
    print(f"General Resume Score: {resume_score}%")

    print("\n====== JOB MATCHING ======")
    print(f"TF-IDF Semantic Score: {tfidf_score}%")
    print(f"Final Job Fit Score: {final_score}%")

    print("\n====== SKILL ANALYSIS ======")
    print("Matched Skills:")
    for s in matched_skills:
        print(" -", s)

    print("\nMissing Skills:")
    for s in missing_skills:
        print(" -", s)
