import fitz  # PyMuPDF
import sys

from job_matcher import match_resume_to_job
from skill_gap import skill_gap_analysis
from skill_extractor import extract_skills
from scorer import score_resume


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


if __name__ == "__main__":
    # 1. Get PDF path
    pdf_path = sys.argv[1]

    # 2. Extract raw text
    extracted_text = extract_text_from_pdf(pdf_path)

    # 3. Extract skills using NLP logic
    skills = extract_skills(extracted_text)

    # 4. Score resume
    score = score_resume(skills)

    # 5. Job description (Temporary hardcoded for demonstration)
    job_description = """Looking for a MERN stack developer with experience in React, Node.js,
    MongoDB, REST APIs, and basic machine learning knowledge."""

    # 6. Match resume to job
    job_match_score = match_resume_to_job(extracted_text, job_description)

    # 7. Skill gap analysis
    gap = skill_gap_analysis(extracted_text, job_description)

    # 8. Output results
    print("\n====== EXTRACTED TEXT (PREVIEW) ======\n")
    print(extracted_text[:800])  # preview only

    print("\n====== EXTRACTED SKILLS ======\n")
    for category, values in skills.items():
        print(f"{category}: {values}")

    print("\n====== RESUME SCORE ======\n")
    print(f"General Resume Score: {score}%")

    print("\n====== JOB MATCH SCORE ======\n")
    print(f"Job Match Score: {job_match_score}%")

    print("\n====== SKILL GAP ANALYSIS ======\n")
    print("Matched Skills:")
    for skill in gap["matched_skills"]:
        print(f"  - {skill}")
    print("Missing Skills:")
    for skill in gap["missing_skills"]:
        print(f"  - {skill}")