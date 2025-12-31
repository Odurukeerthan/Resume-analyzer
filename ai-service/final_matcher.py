def final_job_fit_score(matched_skills, jd_skills, tfidf_score):
    if len(jd_skills) == 0:
        return tfidf_score

    skill_match_score = (len(matched_skills) / len(jd_skills)) * 100

    final_score = (0.7 * skill_match_score) + (0.3 * tfidf_score)
    return round(final_score, 2)
