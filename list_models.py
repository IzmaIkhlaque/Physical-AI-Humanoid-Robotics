"""
List all available Gemini models
"""
import sys
import os
import google.generativeai as genai

GEMINI_API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not provided!")
    print("Run: python list_models.py YOUR_API_KEY")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

print("=" * 70)
print("AVAILABLE GEMINI MODELS")
print("=" * 70)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"\nModel: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print(f"  Supported Methods: {', '.join(model.supported_generation_methods)}")
