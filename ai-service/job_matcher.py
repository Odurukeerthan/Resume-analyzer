from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import clean_text

def match_resume_to_job(resume_text, job_text):
    resume_text = clean_text(resume_text)
    job_text = clean_text(job_text)

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=3000
    )

    tfidf = vectorizer.fit_transform([resume_text, job_text])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

    return round(similarity * 100, 2)
