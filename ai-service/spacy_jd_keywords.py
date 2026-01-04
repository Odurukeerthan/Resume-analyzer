import spacy

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp

def extract_dynamic_jd_keywords(text):
    nlp = get_nlp()
    doc = nlp(text)
    return set(chunk.text.lower() for chunk in doc.noun_chunks)
