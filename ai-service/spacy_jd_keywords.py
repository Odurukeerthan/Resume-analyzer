import spacy
from utils import clean_text

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


# Minimal stop phrases (manual, not AI-generated)
STOP_PHRASES = {
    "experience",
    "knowledge",
    "a plus",
    "strong experience",
    "we",
    "you",
    "candidate",
    "developer",
    "role"
}

def extract_dynamic_jd_keywords(text: str) -> set:
    text = clean_text(text)
    nlp = get_nlp()
    doc = nlp(text)

    keywords = set()

    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip().lower()

        # Length filter
        if len(phrase) < 3 or len(phrase) > 40:
            continue

        # Stop phrase filter
        if phrase in STOP_PHRASES:
            continue

        # Token sanity check (avoid full sentences)
        if len(phrase.split()) > 4:
            continue

        keywords.add(phrase)

    return keywords
