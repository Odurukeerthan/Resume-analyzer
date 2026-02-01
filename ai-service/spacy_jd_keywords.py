import spacy
import sys
from utils import clean_text

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except Exception as e:
            print(f"Warning: Failed to load spaCy model: {e}", file=sys.stderr)
            raise
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
    try:
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
    except Exception as e:
        # Return empty set if spaCy fails (memory issues, model not found, etc.)
        print(f"Warning: spaCy keyword extraction failed: {e}", file=sys.stderr)
        return set()
