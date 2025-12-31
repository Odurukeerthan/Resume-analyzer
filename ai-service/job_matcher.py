from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import clean_text

def match_resume_to_job(resume_text, job_text):
    resume_text=clean_text(resume_text)
    job_text=clean_text(job_text)

    vectorizer=TfidfVectorizer(stop_words="english")
    tfidf_matrix=vectorizer.fit_transform([resume_text,job_text])
    similarity=cosine_similarity(tfidf_matrix[0:1],tfidf_matrix[1:2])
    score=round(similarity[0][0]*100,2)
    return score
    