def score_resume(extracted_skills):
    score = 0
    for category in extracted_skills:
        score += len(extracted_skills[category]) * 10
    return min(score, 100)
