import os
import time
from dotenv import load_dotenv
from google.genai import Client, errors

load_dotenv()

client = Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_ai_suggestions(job_role, final_score, missing_skills):
    missing = ", ".join(missing_skills) if missing_skills else "None"
    
    # Improved prompt for a "Professional" look
    prompt = f"""
    You are an expert Technical Recruiter.
    Candidate Match Score for {job_role}: {final_score}%
    Key Skills Missing: {missing}

    Please provide 3 professional, actionable suggestions to improve the resume. 
    Use the following format:
    1. **[Category]**: Actionable advice.
    2. **[Category]**: Actionable advice.
    3. **[Category]**: Actionable advice.
    
    Keep it concise and encouraging.
    """

    # Retry logic to handle the "429 Resource Exhausted" error
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash", # Changed to 1.5 for better free-tier stability
                contents=prompt
            )
            return response.text
        except Exception as e:
            if "429" in str(e):
                print(f"Rate limit hit. Attempt {attempt + 1}. Retrying in 5s...")
                time.sleep(5) # Wait before retrying
            else:
                print(f"LLM Error: {e}")
                break
                
    return "💡 Tip: Focus on highlighting your core projects while we refresh your personalized suggestions."