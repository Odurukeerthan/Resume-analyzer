def extract_sections(text: str) -> dict:
    text = text.lower()
    return {
        "summary": any(k in text for k in ["summary", "profile", "objective"]),
        "skills": "skill" in text,
        "experience": "experience" in text,
        "projects": "project" in text,
        "education": "education" in text
    }
