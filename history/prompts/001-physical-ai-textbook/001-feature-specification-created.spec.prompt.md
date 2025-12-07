---
id: 001
title: Feature Specification Created for Physical AI Textbook
stage: spec
date: 2025-12-05
surface: agent
model: claude-opus-4-5-20251101
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: Izma
command: /sp.specify
labels: ["spec", "docusaurus", "textbook", "physical-ai", "robotics", "i18n", "authentication"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-physical-ai-textbook/spec.md
  - specs/001-physical-ai-textbook/checklists/requirements.md
tests:
  - null
---

## Prompt

/sp.specify
BOOK TITLE: Izma's Physical AI & Humanoid Robotics Textbook

MANDATORY RULES – FOLLOW EXACTLY:
1. Docusaurus version: exactly 3.5.2
2. Install command (must use):
   npx create-docusaurus@3.5.2 textbook classic --typescript
   then: rm -rf node_modules package-lock.json && pnpm install
3. Add Tailwind CSS: pnpm add -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
4. i18n: ONLY Docusaurus built-in. Generate /i18n/ur/docs/ mirror of /docs/
5. No Google Translate, DeepL, LibreTranslate allowed

FILE STRUCTURE (create all folders/files first):
root/
  docusaurus.config.js
  src/pages/index.md                  ← Hero landing page
  src/css/custom.css                 ← Tailwind + glassmorphism
  static/img/book-cover.png          ← Generate 1200×630 PNG
  static/img/logo.png                ← Generate logo
  docs/part1/chapter1/lesson1.md … lesson7.md (4–7 lessons per chapter)
  i18n/ur/docs/part1/chapter1/lesson1.md … (exact Urdu mirror)
  src/components/ChatKitPanel.tsx
  src/components/PersonalizeTips.tsx
  src/components/LanguageSwitcher.tsx
  backend/app/main.py                ← FastAPI
  backend/db/schema.sql              ← Neon table user_prefs

LANDING PAGE (src/pages/index.md):
- Big hero with title, subtitle, 2-paragraph description
- Keywords list with emojis
- AI-generated book cover image
- "Start Reading" button → /docs/part1
- Header: left logo + "Izma's Textbook", right GitHub icon + theme toggle
- Fully responsive (Tailwind)

BOOK CONTENT – EXACT STRUCTURE:
Part 1: 4 Chapters → each chapter 5 lessons
Part 2: 4 Chapters → each chapter 6 lessons
Part 3: 5 Chapters → each chapter 5 lessons
Part 4: 4 Chapters → each chapter 7 lessons
Total ≈ 100+ markdown files
Every lesson must contain:
   • 3-bullet recap of previous lesson
   • 800–1200 words beginner-friendly content
   • Real examples + code snippets
   • 1–2 activities
   • 1 diagram (SVG in /static/img/)
   • 10 optional MCQs at the end
   • Correct relative links: [Next →](./lesson2.md)

URDU TRANSLATION:
Generate perfect Urdu mirror in /i18n/ur/docs/ using Noto Nastaliq Urdu font.
Language switcher in header visible ONLY when logged in.

BETTER AUTH + PERSONALIZATION:
- Signup page: email, password + two questions:
   1. Level dropdown (Beginner/Intermediate/Advanced) – required
   2. Hardware access text field – optional
- Store in Neon table: user_prefs (user_id, level, hardware)
- When logged in → show personalized tips overlay based on level
- When NOT logged in → hide ChatKit, Urdu switcher, personalize button
  → show toast "Login required" + redirect to /login

CHATKIT RAG BOT:
- Floating button bottom-right
- Text selection → auto open panel with selected text
- Bot name: "AI Robotics Guide"
- Answers only from book content (Qdrant + OpenAI)
- Visible and working ONLY when logged in

ERROR HANDLING:
- Responsive navbar/footer with Tailwind
- React ErrorBoundary on navigation
- Toastify for every error
- Pytest tests for login redirect

REUSABLE INTELLIGENCE:
Minimum 25 different subagents. Each subagent must make its own commit with message "Subagent [Name]: completed task"
Examples: CoverImageAgent, UrduTranslationAgent, PersonalizeTipsAgent, ChatKitAgent, NavbarAgent, etc.

## Response snapshot

Created comprehensive feature specification with:
- 7 prioritized user stories (P1-P7) covering all user journeys
- 51 functional requirements organized by category
- 16 measurable success criteria
- 6 key entities defined
- 10 assumptions documented
- 10 out-of-scope items clarified
- Quality checklist passed all validation items

Key deliverables:
1. `specs/001-physical-ai-textbook/spec.md` - Full specification
2. `specs/001-physical-ai-textbook/checklists/requirements.md` - Validation checklist

## Outcome

- ✅ Impact: Complete specification ready for implementation planning
- 🧪 Tests: N/A (specification phase)
- 📁 Files: 2 files created (spec.md, requirements.md checklist)
- 🔁 Next prompts: `/sp.plan` to create implementation architecture, `/sp.tasks` to generate task list
- 🧠 Reflection: User provided extremely detailed requirements allowing zero clarification markers

## Evaluation notes (flywheel)

- Failure modes observed: None - clear user requirements
- Graders run and results (PASS/FAIL): PASS - All checklist items validated
- Prompt variant (if applicable): Standard spec creation with detailed user input
- Next experiment (smallest change to try): Consider adding content outline for each Part/Chapter in spec
