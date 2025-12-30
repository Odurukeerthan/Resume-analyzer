from skills import SKILLS
from utils import clean_text

def extract_skills(text):
    text = clean_text(text)
    found_skills = {}

    for category, skills in SKILLS.items():
        matched = []
        for skill in skills:
            if skill in text:
                matched.append(skill)
        if matched:
            found_skills[category] = matched

    return found_skills
