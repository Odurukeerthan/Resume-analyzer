import spacy
from utils import clean_text

nlp = spacy.load("en_core_web_sm")

def extract_dynamic_jd_keywords(job_text):
    job_text = clean_text(job_text)
    doc = nlp(job_text)

    keywords = set()
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip()
        if len(phrase) > 2:
            keywords.add(phrase)

    return keywords
