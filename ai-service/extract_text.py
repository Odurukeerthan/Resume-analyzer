import fitz  # PyMuPDF
import sys

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

    # 5. Output results
    print("\n====== EXTRACTED TEXT (PREVIEW) ======\n")
    print(extracted_text[:800])  # preview only

    print("\n====== EXTRACTED SKILLS ======\n")
    for category, values in skills.items():
        print(f"{category}: {values}")

    print("\n====== RESUME SCORE ======\n")
    print(f"Score: {score}/100")
