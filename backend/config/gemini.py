import os
import itertools
import google.generativeai as genai

_keys = [
  os.getenv(f"GEMINI_API_KEY_{i}") 
  for i in range(1, 7) 
  if os.getenv(f"GEMINI_API_KEY_{i}")
]

_key_cycle = itertools.cycle(_keys)

def get_gemini_model():
  key = next(_key_cycle)
  genai.configure(api_key=key)
  return genai.GenerativeModel("gemini-1.5-flash")

def call_gemini_with_fallback(prompt: str) -> str:
  tried = 0
  total = len(_keys)
  last_error = None
  while tried < total:
    try:
      model = get_gemini_model()
      response = model.generate_content(prompt)
      return response.text
    except Exception as e:
      if "429" in str(e) or "quota" in str(e).lower() or "exhausted" in str(e).lower():
        tried += 1
        last_error = e
        continue
      raise e
  raise Exception(f"All Gemini keys exhausted. Last error: {last_error}")
