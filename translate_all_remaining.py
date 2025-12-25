"""
Complete Urdu Translation - ALL Remaining Files
Translates every English lesson that doesn't have Urdu content yet
"""

import os
import sys
import google.generativeai as genai
import time
import glob

# Configure Gemini API
GEMINI_API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not provided!")
    print("Run: python translate_all_remaining.py YOUR_API_KEY")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)
# Use flash-lite model - different quota limit
model = genai.GenerativeModel('gemini-2.5-flash-lite')

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
7. Technical terms can use transliteration (روبوٹ, سینسر, AI = اے آئی)
8. Preserve structure and formatting exactly

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

def has_urdu_content(file_path):
    """Check if file has actual Urdu script content"""
    if not os.path.exists(file_path):
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for Urdu Unicode characters
            return any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in content[:1000])
    except:
        return False

def translate_file(english_path):
    """Translate a single file"""
    urdu_path = get_urdu_path(english_path)

    # Check if already has Urdu content
    if has_urdu_content(urdu_path):
        print(f"[SKIP] Already translated: {english_path}")
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
    print("=" * 70)
    print("COMPLETE URDU TRANSLATION - ALL REMAINING FILES")
    print("=" * 70)

    # Find all English markdown files
    all_english_files = glob.glob("textbook/docs/**/*.md", recursive=True)

    # Filter out files that already have Urdu content
    files_to_translate = []
    already_translated = []

    for eng_file in all_english_files:
        urdu_file = get_urdu_path(eng_file)
        if has_urdu_content(urdu_file):
            already_translated.append(eng_file)
        else:
            files_to_translate.append(eng_file)

    print(f"\nFound {len(all_english_files)} total English files")
    print(f"Already translated: {len(already_translated)}")
    print(f"Need to translate: {len(files_to_translate)}")
    print()

    if len(files_to_translate) == 0:
        print("[OK] All files already translated!")
        return

    # Confirm before starting
    print(f"About to translate {len(files_to_translate)} files.")
    print(f"Estimated time: {len(files_to_translate) * 3 // 60} minutes")
    print()

    success_count = 0
    failed_files = []

    for i, file_path in enumerate(files_to_translate, 1):
        print(f"\n[{i}/{len(files_to_translate)}] {file_path}")

        if translate_file(file_path):
            success_count += 1
        else:
            failed_files.append(file_path)

        # Rate limiting - Gemini free tier: 5 requests/min = 12 seconds between requests
        if i < len(files_to_translate):
            print(f"[WAIT] Cooling down 13 seconds for API rate limit...")
            time.sleep(13)

    print("\n" + "=" * 70)
    print("TRANSLATION COMPLETE!")
    print("=" * 70)
    print(f"[OK] Successful: {success_count}/{len(files_to_translate)}")
    print(f"[OK] Already had Urdu: {len(already_translated)}")
    print(f"[OK] Total Urdu files: {success_count + len(already_translated)}/{len(all_english_files)}")

    if failed_files:
        print(f"\n[FAIL] Failed: {len(failed_files)}")
        for f in failed_files[:10]:  # Show first 10
            print(f"  - {f}")
        if len(failed_files) > 10:
            print(f"  ... and {len(failed_files) - 10} more")

    print("\nNext steps:")
    print("1. Run: cd textbook && npm run build")
    print("2. Test Urdu pages at /ur/...")
    print("3. Commit changes: git add . && git commit -m 'Complete Urdu translation'")

if __name__ == "__main__":
    main()
