"""
spider_metrics.py

Deterministic spider (radar) chart metric extractor.
NO AI scoring. NO hallucinations. Fully explainable.

Inputs:
- clean_resume_text (str) : output of utils.clean_text()
- sections_present (dict): output of extract_sections()

Output:
- dict with 6 radar-axis scores (0–100)
"""

import re

# -----------------------------
# CANONICAL SIGNAL DICTIONARIES
# -----------------------------

CODING_SKILLS = {
    "python", "java", "c", "c++", "javascript", "typescript",
    "react", "node.js", "express", "mongodb", "sql"
}

DESIGN_KEYWORDS = {
    "ui", "ux", "responsive", "accessibility",
    "figma", "wireframe", "tailwind", "bootstrap", "design system"
}

PROBLEM_SOLVING_VERBS = {
    "optimized", "improved", "reduced", "solved",
    "debugged", "refactored", "enhanced", "implemented"
}

LEADERSHIP_KEYWORDS = {
    "led", "managed", "mentored", "coordinated",
    "owned", "reviewed", "guided"
}

# -----------------------------
# CORE HELPERS (SAFE & SIMPLE)
# -----------------------------

def count_unique_matches(text: str, keywords: set) -> int:
    """
    Counts unique keyword hits in text.
    No weighting. No frequency inflation.
    """
    return sum(1 for kw in keywords if kw in text)


# -----------------------------
# AXIS SCORING FUNCTIONS
# -----------------------------

def score_coding(text: str) -> int:
    """
    Coding score based on verified technical skills.
    """
    hits = count_unique_matches(text, CODING_SKILLS)
    return min(hits * 10, 100)


def score_design(text: str) -> int:
    """
    Design score based on UI/UX and tooling mentions.
    """
    hits = count_unique_matches(text, DESIGN_KEYWORDS)
    return min(hits * 15, 100)


def score_experience(text: str) -> int:
    """
    Experience score based on year mentions (YYYY).
    Conservative by design.
    """
    years = re.findall(r"(20\d{2})", text)
    unique_years = len(set(years))
    return min(unique_years * 10, 100)


def score_problem_solving(text: str) -> int:
    """
    Problem-solving score from explicit action verbs.
    """
    hits = count_unique_matches(text, PROBLEM_SOLVING_VERBS)
    return min(hits * 12, 100)


def score_communication(sections_present: dict) -> int:
    """
    Communication proxy score.
    Presence of a summary/profile section only.
    """
    return 75 if sections_present.get("summary") else 40


def score_leadership(text: str) -> int:
    """
    Leadership score from explicit leadership verbs only.
    """
    hits = count_unique_matches(text, LEADERSHIP_KEYWORDS)
    return min(hits * 20, 100)


# -----------------------------
# MASTER ENTRY POINT
# -----------------------------

def compute_spider_metrics(clean_resume_text: str, sections_present: dict) -> dict:
    """
    Computes all spider chart metrics.

    Returns:
    {
        "coding": int,
        "design": int,
        "experience": int,
        "problem_solving": int,
        "communication": int,
        "leadership": int
    }
    """
    return {
        "coding": score_coding(clean_resume_text),
        "design": score_design(clean_resume_text),
        "experience": score_experience(clean_resume_text),
        "problem_solving": score_problem_solving(clean_resume_text),
        "communication": score_communication(sections_present),
        "leadership": score_leadership(clean_resume_text),
    }
