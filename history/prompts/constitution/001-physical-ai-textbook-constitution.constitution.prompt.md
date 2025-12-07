---
id: 001
title: Physical AI Textbook Constitution Created
stage: constitution
date: 2025-12-05
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: Izma
command: /sp.constitution
labels: ["constitution", "project-setup", "docusaurus", "physical-ai", "robotics"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

/sp.constitution
Project Name: Izma's Physical AI & Humanoid Robotics Textbook
Vision: Create a complete, beautiful, fully functional textbook website using ONLY Docusaurus v3.5.2.
Everything must be 100% AI-generated using 25+ Claude subagents.
All premium features are strictly locked behind login:
   → ChatKit RAG bot
   → Urdu language switcher
   → Personalized tips (Beginner / Intermediate / Advanced)
Non-logged users see only static English book + toast + redirect to login when they try premium features.
During signup ask two questions:
   1. Your level? → dropdown: Beginner / Intermediate / Advanced (required)
   2. Hardware access? → text field (optional)
Store answers in Neon PostgreSQL.
Use Docusaurus built-in i18n for Urdu (no external API).
Theme: Navy blue (#001F3F) + black with glassmorphism blur effects.
Fully responsive navbar and footer.
Generate book cover + 30+ diagrams.
Success: Live on Vercel, no errors, no broken links, <90s demo video.

## Response snapshot

Created comprehensive project constitution v1.0.0 with 8 core principles:
1. Docusaurus-Only Architecture - Exclusive use of Docusaurus v3.5.2
2. AI-Generated Content Mandate - 25+ Claude subagents for all content
3. Authentication-Gated Premium Features - ChatKit, Urdu, personalized tips locked
4. User Data Collection Requirements - Level (required) + Hardware (optional) → Neon PostgreSQL
5. Design System Compliance - Navy blue (#001F3F), black, glassmorphism
6. Zero-Error Deployment Standard - No errors, no broken links, <90s demo
7. Accessibility and Internationalization - Built-in i18n, RTL support
8. Performance and Security - Lighthouse >80, secure auth

Added Technology Stack Constraints, Development Workflow, and Governance sections.

## Outcome

- ✅ Impact: Established foundational governance document for entire project
- 🧪 Tests: N/A (constitution document)
- 📁 Files: .specify/memory/constitution.md created
- 🔁 Next prompts: /sp.specify to create feature specifications, /sp.plan for implementation planning
- 🧠 Reflection: Constitution captures all user requirements with testable, declarative principles

## Evaluation notes (flywheel)

- Failure modes observed: None - clear requirements provided
- Graders run and results (PASS/FAIL): PASS - All placeholders filled, version semantic
- Prompt variant (if applicable): Standard constitution creation
- Next experiment (smallest change to try): Add specific API endpoint contracts in future ADR
