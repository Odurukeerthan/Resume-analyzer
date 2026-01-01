import spacy
from utils import clean_text

nlp = spacy.load("en_core_web_sm")
FORBIDDEN_KEYWORDS = {"knowledge", "experience", "strong experience", "ability", "plus"}
def extract_dynamic_jd_keywords(job_text):
    doc = nlp(job_text)
    keywords = set()
    for chunk in doc.noun_chunks:
        phrase = chunk.text.lower().strip()
        if phrase not in FORBIDDEN_KEYWORDS and len(phrase) > 3:
            keywords.add(phrase)
    return keywords
