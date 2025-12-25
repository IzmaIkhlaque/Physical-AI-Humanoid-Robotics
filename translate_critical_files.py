"""
Translate critical files for Urdu demo
- Part intros (5 files)
- First lesson of each chapter (~10 files)
Total: ~15 files for quick demo
"""

import os
import google.generativeai as genai
import time

# Configure Gemini API
import sys
GEMINI_API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not provided!")
    print("Run: python translate_critical_files.py YOUR_API_KEY")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Critical files to translate (in order of importance)
CRITICAL_FILES = [
    # Part intros
    "textbook/docs/part1/intro.md",
    "textbook/docs/part2/intro.md",
    "textbook/docs/part3/intro.md",
    "textbook/docs/part4/intro.md",
    "textbook/docs/part5/intro.md",

    # Part 1 - First lessons of each chapter
    "textbook/docs/part1/chapter1-what-is-physical-ai/lesson1-defining-physical-ai.md",
    "textbook/docs/part1/chapter2-foundations-of-robotics/lesson1-mechanical-systems.md",
    "textbook/docs/part1/chapter3-ai-fundamentals/lesson1-machine-learning-basics.md",

    # Part 2 - First lessons
    "textbook/docs/part2/chapter1-humanoid-design/lesson1-biped-mechanics.md",
    "textbook/docs/part2/chapter2-locomotion/lesson1-walking-gaits.md",

    # Part 3 - First lesson
    "textbook/docs/part3/chapter1-perception-ai/lesson1.md",

    # Part 4 - First lesson
    "textbook/docs/part4/chapter1-industrial-applications/lesson1.md",

    # Part 5 - First lesson
    "textbook/docs/part5/chapter1-humanoids-in-everyday-life/lesson1-humanoids-in-the-smart-home.md",
]

def translate_to_urdu(english_content):
    """Translate English markdown content to Urdu using Gemini"""

    prompt = f"""Translate the following markdown content to Urdu (اردو).

IMPORTANT RULES:
1. Translate YAML frontmatter fields (title, description, sidebar_label) to Urdu
2. Translate ALL headings, paragraphs, bullet points, and text to Urdu
3. Keep code blocks in ENGLISH (do not translate code)
4. Keep image paths unchanged: ![alt](/img/path.svg)
5. Keep markdown syntax (##, -, *, etc.)
6. Use proper Urdu script and RTL formatting
7. Technical terms can use transliteration (روبوٹ, سینسر, etc.)

English Content:
{english_content}

Urdu Translation:"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Translation error: {e}")
        return None

def get_urdu_path(english_path):
    """Convert English path to Urdu i18n path"""
    return english_path.replace(
        "textbook/docs/",
        "textbook/i18n/ur/docusaurus-plugin-content-docs/current/"
    )

def translate_file(english_path):
    """Translate a single file"""
    urdu_path = get_urdu_path(english_path)

    # Check if already translated
    if os.path.exists(urdu_path):
        with open(urdu_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check if it has Urdu script
            if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in content[:500]):
                print(f"[OK] SKIP: {english_path} (already translated)")
                return True

    # Read English file
    if not os.path.exists(english_path):
        print(f"[ERROR] File not found: {english_path}")
        return False

    with open(english_path, 'r', encoding='utf-8') as f:
        english_content = f.read()

    print(f"[...] Translating: {english_path}")

    # Translate
    urdu_content = translate_to_urdu(english_content)

    if not urdu_content:
        print(f"[FAIL] Translation failed for {english_path}")
        return False

    # Create directory if needed
    urdu_dir = os.path.dirname(urdu_path)
    os.makedirs(urdu_dir, exist_ok=True)

    # Write Urdu file
    with open(urdu_path, 'w', encoding='utf-8') as f:
        f.write(urdu_content)

    print(f"[OK] SUCCESS: {urdu_path}")
    return True

def main():
    print("=" * 60)
    print("CRITICAL FILES TRANSLATION FOR URDU DEMO")
    print("=" * 60)
    print(f"Total files to translate: {len(CRITICAL_FILES)}")
    print()

    success_count = 0
    failed_files = []

    for i, file_path in enumerate(CRITICAL_FILES, 1):
        print(f"\n[{i}/{len(CRITICAL_FILES)}] {file_path}")

        if translate_file(file_path):
            success_count += 1
        else:
            failed_files.append(file_path)

        # Rate limiting - wait 2 seconds between requests
        if i < len(CRITICAL_FILES):
            time.sleep(2)

    print("\n" + "=" * 60)
    print("TRANSLATION COMPLETE!")
    print("=" * 60)
    print(f"[OK] Successful: {success_count}/{len(CRITICAL_FILES)}")
    if failed_files:
        print(f"[FAIL] Failed: {len(failed_files)}")
        for f in failed_files:
            print(f"  - {f}")
    print()
    print("Next steps:")
    print("1. Run: cd textbook && npm run build")
    print("2. Test Urdu pages at /ur/...")
    print("3. Implement per-chapter translation button")

if __name__ == "__main__":
    main()
