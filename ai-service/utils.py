import re
import unicodedata

def clean_text(text: str) -> str:
    # Normalize unicode (fix ligatures, smart chars)
    text = unicodedata.normalize("NFKD", text)

    # Remove non-printable characters
    text = "".join(ch for ch in text if ch.isprintable())

    # Lowercase
    text = text.lower()

    # Keep only resume-relevant characters
    text = re.sub(r"[^a-z0-9+.#\s]", " ", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text
