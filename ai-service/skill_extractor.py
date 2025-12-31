from skills import SKILL_ALIASES
from utils import clean_text

def extract_skills(text):
    text = clean_text(text)
    found_skills = set()

    for canonical, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            if alias in text:
                found_skills.add(canonical)
                break

    return found_skills
