# Tasks: Izma's Physical AI & Humanoid Robotics Textbook

**Input**: Design documents from `/specs/001-physical-ai-textbook/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml
**Branch**: `001-physical-ai-textbook`
**Total Tasks**: 85 tasks across 26 subagents

## Format: `[ID] [P?] [Agent] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Agent]**: Which subagent owns this task
- Include exact file paths and error handling in descriptions

---

## Phase 1: Setup (Docusaurus + Tailwind Installation)

**Goal**: Initialize Docusaurus 3.5.2 project with Tailwind CSS and glassmorphism styling
**Checkpoint**: Site runs on localhost:3000 with navy blue theme

- [ ] T001 [DocusaurusSetupAgent] Run `npx create-docusaurus@3.5.2 textbook classic --typescript` in project root. Error handling: If command fails, verify Node.js 18+ installed and retry with `--force` flag.

- [ ] T002 [DocusaurusSetupAgent] Remove npm artifacts with `rm -rf textbook/node_modules textbook/package-lock.json` then run `cd textbook && pnpm install`. Error handling: If pnpm not found, install via `npm install -g pnpm`.

- [ ] T003 [TailwindConfigAgent] Install Tailwind with `cd textbook && pnpm add -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`. Error handling: If postcss conflict, delete postcss.config.js and retry.

- [ ] T004 [TailwindConfigAgent] Configure textbook/tailwind.config.js with Docusaurus content paths: `content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}', './docs/**/*.{md,mdx}']`. Error handling: If styles not applying, verify file paths match project structure.

- [ ] T005 [TailwindConfigAgent] Add Tailwind directives to textbook/src/css/custom.css: `@tailwind base; @tailwind components; @tailwind utilities;` plus glassmorphism classes. Error handling: If CSS not loading, check docusaurus.config.ts stylesheets array.

- [ ] T006 [TailwindConfigAgent] Configure Navy blue (#001F3F) and black theme in textbook/src/css/custom.css with CSS variables `--ifm-color-primary`. Error handling: If colors not applying, clear browser cache and rebuild.

- [ ] T007 [P] [ProjectStructureAgent] Create directory structure: textbook/src/components/, textbook/src/pages/, textbook/static/img/diagrams/. Error handling: If mkdir fails, check write permissions.

- [ ] T008 [P] [ProjectStructureAgent] Create directory structure: textbook/backend/app/, textbook/backend/db/, textbook/backend/tests/. Error handling: Verify parent directories exist first.

- [ ] T009 [ProjectStructureAgent] Create .env.example file in textbook/ with placeholders for DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY. Error handling: Never commit actual secrets.

- [ ] T010 [DocusaurusSetupAgent] Update textbook/docusaurus.config.ts with site title "Izma's Physical AI & Humanoid Robotics Textbook", tagline, and URL. Error handling: If config invalid, run `pnpm build` to see syntax errors.

**Commit**: `Subagent [DocusaurusSetupAgent]: Initialize Docusaurus 3.5.2 with TypeScript`
**Commit**: `Subagent [TailwindConfigAgent]: Configure Tailwind CSS with glassmorphism`
**Commit**: `Subagent [ProjectStructureAgent]: Create project folder structure`

---

## Phase 2: Visual Assets (Cover, Logo, Diagrams)

**Goal**: Generate all visual assets for the textbook
**Checkpoint**: All images accessible in static/img/ with proper alt text naming

- [ ] T011 [CoverImageAgent] Generate book cover image (1200×630 PNG) with prompt: "Modern textbook cover Physical AI Humanoid Robotics, navy blue #001F3F theme, futuristic robot, professional design". Save to textbook/static/img/book-cover.png. Error handling: If generation fails, retry with simplified prompt or use placeholder.

- [ ] T012 [CoverImageAgent] Verify book-cover.png dimensions are exactly 1200×630 and file size under 500KB. Error handling: If oversized, compress with imagemin or reduce quality.

- [ ] T013 [LogoAgent] Generate logo icon (512×512 PNG) with robotics theme matching navy blue color scheme. Save to textbook/static/img/logo.png. Error handling: If generation fails, create simple text-based logo.

- [ ] T014 [LogoAgent] Generate favicon.ico (32×32) from logo and save to textbook/static/img/favicon.ico. Error handling: If ICO conversion fails, use PNG fallback.

- [ ] T015 [P] [DiagramAgent] Generate 8 diagrams for Part 1 chapters (diagram-p1-c1-l1.svg through diagram-p1-c4-l5.svg) covering Physical AI concepts. Save to textbook/static/img/diagrams/. Error handling: If SVG generation fails, use Mermaid.js flowchart fallback.

- [ ] T016 [P] [DiagramAgent] Generate 8 diagrams for Part 2 chapters (diagram-p2-c1-l1.svg through diagram-p2-c4-l6.svg) covering humanoid robotics fundamentals. Error handling: Ensure all diagrams have descriptive filenames for alt text.

- [ ] T017 [P] [DiagramAgent] Generate 8 diagrams for Part 3 chapters (diagram-p3-c1-l1.svg through diagram-p3-c5-l5.svg) covering sensors and perception. Error handling: Validate SVG syntax with xmllint.

- [ ] T018 [P] [DiagramAgent] Generate 8 diagrams for Part 4 chapters (diagram-p4-c1-l1.svg through diagram-p4-c4-l7.svg) covering advanced applications. Error handling: If batch generation fails, generate individually.

**Commit**: `Subagent [CoverImageAgent]: Generate book cover image`
**Commit**: `Subagent [LogoAgent]: Generate logo and favicon`
**Commit**: `Subagent [DiagramAgent]: Generate 30+ technical diagrams`

---

## Phase 3: English Content Generation (100+ Lessons)

**Goal**: Generate all textbook content in English with proper Docusaurus structure
**Checkpoint**: All 97 lessons render without errors, navigation works

### Part 1: Introduction to Physical AI (20 lessons)

- [ ] T019 [Part1ContentAgent] Create textbook/docs/part1/_category_.json with label "Part 1: Introduction to Physical AI", position 1. Error handling: Validate JSON syntax.

- [ ] T020 [Part1ContentAgent] Create textbook/docs/part1/chapter1/_category_.json and generate 5 lessons (lesson1.md-lesson5.md) for "What is Physical AI?" (800-1200 words each, 3-bullet recap, code examples, activities). Error handling: If content <800 words, regenerate with explicit word count.

- [ ] T021 [P] [Part1ContentAgent] Create textbook/docs/part1/chapter2/_category_.json and generate 5 lessons for "History of Robotics". Error handling: Verify all markdown frontmatter includes sidebar_position, title, description.

- [ ] T022 [P] [Part1ContentAgent] Create textbook/docs/part1/chapter3/_category_.json and generate 5 lessons for "Types of Robots". Error handling: Ensure diagram references point to existing files.

- [ ] T023 [P] [Part1ContentAgent] Create textbook/docs/part1/chapter4/_category_.json and generate 5 lessons for "AI in Physical Systems". Error handling: Validate all internal links with relative paths.

### Part 2: Humanoid Robotics Fundamentals (24 lessons)

- [ ] T024 [Part2ContentAgent] Create textbook/docs/part2/_category_.json with label "Part 2: Humanoid Robotics Fundamentals", position 2. Error handling: JSON must be valid UTF-8.

- [ ] T025 [Part2ContentAgent] Create textbook/docs/part2/chapter1/_category_.json and generate 6 lessons for "Human Anatomy for Roboticists". Error handling: If generation times out, split into 3+3 batches.

- [ ] T026 [P] [Part2ContentAgent] Create textbook/docs/part2/chapter2/_category_.json and generate 6 lessons for "Kinematics and Motion". Error handling: Include code examples in Python for kinematics calculations.

- [ ] T027 [P] [Part2ContentAgent] Create textbook/docs/part2/chapter3/_category_.json and generate 6 lessons for "Actuators and Motors". Error handling: Ensure technical accuracy in motor specifications.

- [ ] T028 [P] [Part2ContentAgent] Create textbook/docs/part2/chapter4/_category_.json and generate 6 lessons for "Power Systems". Error handling: Add safety warnings for electrical content.

### Part 3: Sensors and Perception (25 lessons)

- [ ] T029 [Part3ContentAgent] Create textbook/docs/part3/_category_.json with label "Part 3: Sensors and Perception", position 3. Error handling: Validate position numbers are unique.

- [ ] T030 [Part3ContentAgent] Create textbook/docs/part3/chapter1/_category_.json and generate 5 lessons for "Vision Systems". Error handling: Include OpenCV code examples where relevant.

- [ ] T031 [P] [Part3ContentAgent] Create textbook/docs/part3/chapter2/_category_.json and generate 5 lessons for "Touch and Haptics". Error handling: Reference real sensor components.

- [ ] T032 [P] [Part3ContentAgent] Create textbook/docs/part3/chapter3/_category_.json and generate 5 lessons for "Audio Processing". Error handling: Include audio processing code with librosa/scipy.

- [ ] T033 [P] [Part3ContentAgent] Create textbook/docs/part3/chapter4/_category_.json and generate 5 lessons for "Proprioception". Error handling: Explain IMU and encoder concepts clearly.

- [ ] T034 [P] [Part3ContentAgent] Create textbook/docs/part3/chapter5/_category_.json and generate 5 lessons for "Sensor Fusion". Error handling: Include Kalman filter examples.

### Part 4: Advanced Applications (28 lessons)

- [ ] T035 [Part4ContentAgent] Create textbook/docs/part4/_category_.json with label "Part 4: Advanced Applications", position 4. Error handling: Ensure consistent JSON formatting.

- [ ] T036 [Part4ContentAgent] Create textbook/docs/part4/chapter1/_category_.json and generate 7 lessons for "Locomotion and Balance". Error handling: Include ZMP and inverted pendulum concepts.

- [ ] T037 [P] [Part4ContentAgent] Create textbook/docs/part4/chapter2/_category_.json and generate 7 lessons for "Manipulation and Grasping". Error handling: Cover grasp planning algorithms.

- [ ] T038 [P] [Part4ContentAgent] Create textbook/docs/part4/chapter3/_category_.json and generate 7 lessons for "Human-Robot Interaction". Error handling: Include ethics considerations.

- [ ] T039 [P] [Part4ContentAgent] Create textbook/docs/part4/chapter4/_category_.json and generate 7 lessons for "Real-World Deployment". Error handling: Add practical safety guidelines.

### MCQs for All Lessons

- [ ] T040 [MCQAgent] Add 10 MCQs to each Part 1 lesson (200 questions total) in `<details>` blocks. Error handling: Ensure correct answer is marked, randomize option order.

- [ ] T041 [P] [MCQAgent] Add 10 MCQs to each Part 2 lesson (240 questions total). Error handling: Questions must test comprehension, not just recall.

- [ ] T042 [P] [MCQAgent] Add 10 MCQs to each Part 3 lesson (250 questions total). Error handling: Include application-based questions.

- [ ] T043 [P] [MCQAgent] Add 10 MCQs to each Part 4 lesson (280 questions total). Error handling: Cover advanced topics appropriately.

**Commit**: `Subagent [Part1ContentAgent]: Generate Part 1 lessons (20 files)`
**Commit**: `Subagent [Part2ContentAgent]: Generate Part 2 lessons (24 files)`
**Commit**: `Subagent [Part3ContentAgent]: Generate Part 3 lessons (25 files)`
**Commit**: `Subagent [Part4ContentAgent]: Generate Part 4 lessons (28 files)`
**Commit**: `Subagent [MCQAgent]: Add MCQs to all lessons`

---

## Phase 4: Urdu Translation (i18n Mirror)

**Goal**: Create complete Urdu translation with RTL support
**Checkpoint**: Urdu locale loads correctly with proper font and direction

- [ ] T044 [RTLConfigAgent] Add i18n configuration to textbook/docusaurus.config.ts: defaultLocale 'en', locales ['en', 'ur'], localeConfigs with RTL for Urdu. Error handling: If config breaks build, check syntax carefully.

- [ ] T045 [RTLConfigAgent] Add Noto Nastaliq Urdu font import to textbook/src/css/custom.css via Google Fonts. Error handling: If font not loading, add fallback to Noto Sans Arabic.

- [ ] T046 [RTLConfigAgent] Add RTL CSS rules for Urdu locale in textbook/src/css/custom.css: direction: rtl, text-align: right for .ur-locale selector. Error handling: Test with actual Urdu content.

- [ ] T047 [UrduTranslationAgent] Create textbook/i18n/ur/docusaurus-plugin-content-docs/current/part1/ directory structure mirroring English. Error handling: Ensure exact path structure matches.

- [ ] T048 [UrduTranslationAgent] Translate all Part 1 lessons (20 files) to Urdu, keeping code blocks in English, maintaining markdown structure. Error handling: If translation quality poor, regenerate with more context.

- [ ] T049 [P] [UrduTranslationAgent] Translate all Part 2 lessons (24 files) to Urdu. Error handling: Verify RTL text renders correctly in code blocks.

- [ ] T050 [P] [UrduTranslationAgent] Translate all Part 3 lessons (25 files) to Urdu. Error handling: Technical terms may need transliteration not translation.

- [ ] T051 [P] [UrduTranslationAgent] Translate all Part 4 lessons (28 files) to Urdu. Error handling: Ensure navigation links work for Urdu locale.

- [ ] T052 [UrduTranslationAgent] Create textbook/i18n/ur/docusaurus-theme-classic/ with translated UI strings (sidebar labels, footer text). Error handling: Export default locale strings first as template.

**Commit**: `Subagent [RTLConfigAgent]: Configure RTL and Urdu font`
**Commit**: `Subagent [UrduTranslationAgent]: Translate all lessons to Urdu`

---

## Phase 5: Responsive Navigation (Navbar + Footer)

**Goal**: Create custom responsive navbar and footer with auth-aware elements
**Checkpoint**: Navigation works on all viewports 320px-2560px

- [ ] T053 [NavbarAgent] Create textbook/src/theme/Navbar/index.tsx with custom navbar: logo left, title "Izma's Textbook", GitHub icon + theme toggle right. Error handling: If swizzling fails, use component wrapper approach.

- [ ] T054 [NavbarAgent] Add responsive hamburger menu to Navbar for mobile (<768px) with smooth animation. Error handling: If menu stuck open, add click-outside handler.

- [ ] T055 [NavbarAgent] Create textbook/src/components/LanguageSwitcher.tsx with conditional visibility based on auth state. Error handling: If auth check fails, hide switcher by default.

- [ ] T056 [NavbarAgent] Integrate LanguageSwitcher into Navbar, visible only when user is authenticated. Error handling: Test with both logged-in and anonymous states.

- [ ] T057 [FooterAgent] Create textbook/src/theme/Footer/index.tsx with links to Parts 1-4, copyright, "Built with Docusaurus" credit. Error handling: Ensure all links use correct paths.

- [ ] T058 [FooterAgent] Make Footer responsive with column layout on desktop, stacked on mobile. Error handling: Test footer at 320px width minimum.

- [ ] T059 [NavbarAgent] Add glassmorphism effect to Navbar with backdrop-blur and semi-transparent background. Error handling: If blur not supported, fall back to solid color.

**Commit**: `Subagent [NavbarAgent]: Build responsive navbar with auth awareness`
**Commit**: `Subagent [FooterAgent]: Build responsive footer`

---

## Phase 6: Authentication (Signup + Login + Context)

**Goal**: Implement custom JWT authentication with level and hardware questions
**Checkpoint**: Users can sign up, log in, and access premium features

- [ ] T060 [SignupPageAgent] Create textbook/src/pages/signup.tsx with form: email (required), password (min 8 chars), level dropdown (Beginner/Intermediate/Advanced), hardware text field (optional, max 500 chars). Error handling: Show validation errors inline.

- [ ] T061 [SignupPageAgent] Add form validation to signup: email format check, password strength indicator, level required check. Error handling: If validation fails, highlight specific field.

- [ ] T062 [SignupPageAgent] Connect signup form to POST /api/auth/signup endpoint, handle success (redirect to login) and errors (show toast). Error handling: If API unreachable, show "Network error" toast.

- [ ] T063 [LoginPageAgent] Create textbook/src/pages/login.tsx with email and password fields, "Remember me" checkbox, link to signup. Error handling: Show "Invalid credentials" on 401 response.

- [ ] T064 [LoginPageAgent] Connect login form to POST /api/auth/login endpoint, store JWT on success, redirect to previous page or home. Error handling: If token invalid, clear storage and show error.

- [ ] T065 [AuthContextAgent] Create textbook/src/components/AuthProvider.tsx with React Context for auth state: user, isAuthenticated, login(), logout(), loading. Error handling: If context undefined, throw descriptive error.

- [ ] T066 [AuthContextAgent] Implement JWT storage in localStorage with automatic token refresh check on app load. Error handling: If token expired, clear auth state silently.

- [ ] T067 [AuthContextAgent] Create textbook/src/components/PremiumGate.tsx wrapper that checks auth and shows toast + redirect for unauthenticated users. Error handling: If redirect fails, show manual login link.

- [ ] T068 [AuthContextAgent] Create textbook/src/components/Toast.tsx notification system using react-toastify for success/error/info messages. Error handling: If toastify fails to load, use alert() fallback.

**Commit**: `Subagent [SignupPageAgent]: Create signup page with preference questions`
**Commit**: `Subagent [LoginPageAgent]: Create login page`
**Commit**: `Subagent [AuthContextAgent]: Implement auth context and JWT handling`

---

## Phase 7: Database + API (Neon PostgreSQL)

**Goal**: Set up Neon database and FastAPI backend endpoints
**Checkpoint**: All API endpoints return correct responses

- [ ] T069 [NeonSchemaAgent] Create textbook/backend/db/schema.sql with users, user_prefs, chat_sessions, chat_messages tables per data-model.md. Error handling: Include IF NOT EXISTS for idempotent execution.

- [ ] T070 [NeonSchemaAgent] Add indexes to schema.sql: idx_users_email, idx_chat_sessions_user_id, idx_chat_messages_session_id. Error handling: Verify index names don't conflict.

- [ ] T071 [NeonSchemaAgent] Create textbook/backend/db/connection.py with Neon serverless connection using @neondatabase/serverless driver pattern for Python. Error handling: If connection fails, log error and return 503.

- [ ] T072 [APIRoutesAgent] Create textbook/backend/app/main.py with FastAPI app, CORS middleware for Docusaurus origin. Error handling: If CORS misconfigured, add localhost for development.

- [ ] T073 [APIRoutesAgent] Implement POST /api/auth/signup endpoint in textbook/backend/app/auth.py: validate input, hash password with bcrypt, insert user + prefs, return JWT. Error handling: If email exists, return 409 Conflict.

- [ ] T074 [APIRoutesAgent] Implement POST /api/auth/login endpoint: verify credentials, return JWT with user data. Error handling: If credentials invalid, return 401 with generic message (don't reveal which field wrong).

- [ ] T075 [APIRoutesAgent] Implement POST /api/auth/logout and GET /api/auth/me endpoints. Error handling: If token invalid on /me, return 401.

- [ ] T076 [APIRoutesAgent] Implement GET /api/user/preferences and PUT /api/user/preferences endpoints. Error handling: Validate level enum values strictly.

- [ ] T077 [APIRoutesAgent] Create textbook/backend/app/models.py with Pydantic models: UserCreate, UserLogin, UserResponse, PreferencesUpdate per contracts/openapi.yaml. Error handling: Use strict validation mode.

**Commit**: `Subagent [NeonSchemaAgent]: Create Neon PostgreSQL schema`
**Commit**: `Subagent [APIRoutesAgent]: Implement FastAPI auth and user endpoints`

---

## Phase 8: Personalization Tips

**Goal**: Build personalized tips overlay based on user level
**Checkpoint**: Different tips shown for Beginner/Intermediate/Advanced users

- [ ] T078 [PersonalizeTipsAgent] Create textbook/src/components/PersonalizeTips.tsx with glassmorphism overlay modal. Error handling: If overlay doesn't close, add multiple close mechanisms (X button, outside click, Escape key).

- [ ] T079 [PersonalizeTipsAgent] Add tips content for all three levels in PersonalizeTips.tsx: Beginner (foundational), Intermediate (practical), Advanced (research-oriented). Error handling: If level undefined, default to Beginner.

- [ ] T080 [PersonalizeTipsAgent] Implement hardware-specific tips logic: detect keywords in user's hardware_access field (Arduino, Raspberry Pi, etc.) and show relevant tips. Error handling: If hardware field empty, show generic tips.

- [ ] T081 [PersonalizeTipsAgent] Connect PersonalizeTips to GET /api/tips endpoint and AuthContext for user level. Error handling: If API fails, show cached default tips.

**Commit**: `Subagent [PersonalizeTipsAgent]: Build personalized tips overlay`

---

## Phase 9: ChatKit RAG Bot

**Goal**: Implement AI-powered Q&A chatbot using RAG on textbook content
**Checkpoint**: Bot answers questions from textbook content with sources

- [ ] T082 [ChatKitUIAgent] Create textbook/src/components/ChatKitPanel.tsx with floating button (bottom-right), expandable chat panel, message list, input field. Error handling: If panel stuck open, add forced close button.

- [ ] T083 [ChatKitUIAgent] Add text selection handler to ChatKitPanel: when user selects text on page and opens chat, populate input with selected text. Error handling: If selection API unavailable, skip feature gracefully.

- [ ] T084 [ChatKitUIAgent] Style ChatKitPanel with glassmorphism, bot name "AI Robotics Guide", message bubbles for user/assistant. Error handling: Ensure panel doesn't overflow viewport on mobile.

- [ ] T085 [ChatKitUIAgent] Add loading state, error state, and rate limit warning (10 queries/minute) to ChatKitPanel. Error handling: If rate limited, show countdown timer.

- [ ] T086 [RAGIndexAgent] Create textbook/backend/scripts/index_content.py to read all lesson markdown files, split into ~500 token chunks. Error handling: If file read fails, log and continue with others.

- [ ] T087 [RAGIndexAgent] Generate embeddings for all chunks using OpenAI text-embedding-3-small and store in Qdrant collection "textbook_lessons". Error handling: If OpenAI rate limited, add exponential backoff.

- [ ] T088 [RAGIndexAgent] Store metadata with each chunk: part, chapter, lesson, title, chunk_index for source citation. Error handling: Validate metadata schema before insert.

- [ ] T089 [ChatKitBackendAgent] Implement POST /api/chat/sessions endpoint in textbook/backend/app/chat.py to create new chat session. Error handling: Require authentication, return 401 if not logged in.

- [ ] T090 [ChatKitBackendAgent] Implement POST /api/chat/sessions/{id}/messages endpoint with RAG pipeline: embed question → query Qdrant top 5 → send to GPT-4o-mini with context → return answer with sources. Error handling: If Qdrant unavailable, return friendly error message.

- [ ] T091 [ChatKitBackendAgent] Add response filtering: if question unrelated to robotics, return polite "outside textbook scope" message. Error handling: If OpenAI errors, return generic "try again" message.

**Commit**: `Subagent [ChatKitUIAgent]: Build ChatKit floating panel`
**Commit**: `Subagent [RAGIndexAgent]: Index textbook content in Qdrant`
**Commit**: `Subagent [ChatKitBackendAgent]: Implement RAG query backend`

---

## Phase 10: Testing + Deployment

**Goal**: Comprehensive testing and Vercel deployment
**Checkpoint**: All tests pass, site deployed with zero errors

### Pytest Backend Tests

- [ ] T092 [TestingAgent] Create textbook/backend/tests/test_auth.py with pytest tests: test_signup_success, test_signup_duplicate_email, test_login_success, test_login_invalid_credentials. Error handling: Use test database, rollback after each test.

- [ ] T093 [TestingAgent] Create textbook/backend/tests/test_chat.py with pytest tests: test_create_session, test_send_message, test_rate_limiting, test_unauthenticated_access. Error handling: Mock Qdrant and OpenAI calls.

- [ ] T094 [TestingAgent] Create textbook/backend/tests/test_preferences.py with pytest tests: test_get_preferences, test_update_preferences, test_invalid_level. Error handling: Test all enum values.

### Playwright E2E Tests

- [ ] T095 [TestingAgent] Create textbook/tests/e2e/navigation.spec.ts: test landing page loads, "Start Reading" works, lesson navigation works. Error handling: Add retry logic for flaky tests.

- [ ] T096 [TestingAgent] Create textbook/tests/e2e/auth.spec.ts: test signup flow, login flow, logout, premium gate redirect with toast. Error handling: Clear cookies between tests.

- [ ] T097 [TestingAgent] Create textbook/tests/e2e/responsive.spec.ts: test navbar/footer at 320px, 768px, 1024px, 1440px viewports. Error handling: Screenshot on failure.

### Link Validation

- [ ] T098 [TestingAgent] Run link checker on built site to find broken internal and external links. Error handling: If checker finds issues, create list for manual review.

### Deployment

- [ ] T099 [DeployAgent] Create vercel.json in project root with buildCommand, outputDirectory, and Python function runtime configuration. Error handling: Validate JSON syntax.

- [ ] T100 [DeployAgent] Configure Vercel environment variables: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY. Error handling: Verify all vars set before deploy.

- [ ] T101 [DeployAgent] Run `vercel deploy --prod` and verify successful deployment. Error handling: If build fails, check Vercel logs for specific errors.

- [ ] T102 [DeployAgent] Run Lighthouse audit on deployed site, verify score >80 for Performance, Accessibility, Best Practices, SEO. Error handling: If score below 80, identify and fix top issues.

- [ ] T103 [DeployAgent] Verify zero console errors on deployed site by checking browser DevTools on key pages. Error handling: If errors found, categorize and prioritize fixes.

- [ ] T104 [DeployAgent] Record demo video (<90 seconds) showing: landing page, lesson navigation, signup, login, Urdu switcher, personalized tips, ChatKit interaction. Error handling: If video too long, prioritize key features.

**Commit**: `Subagent [TestingAgent]: Add comprehensive tests`
**Commit**: `Subagent [DeployAgent]: Configure and deploy to Vercel`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────┐
                                                          │
Phase 2 (Assets) ─────────────────────────────────────────┤
    ↓ [parallel with Phase 3]                             │
                                                          ▼
Phase 3 (Content) ────────────────────────────────────> Phase 5 (Navigation)
    ↓                                                     │
Phase 4 (Urdu) ───────────────────────────────────────────┤
                                                          │
Phase 6 (Auth) ───────────────────────────────────────────┤
    ↓                                                     │
Phase 7 (Database) ───────────────────────────────────────┤
    ↓                                                     │
Phase 8 (Tips) ───────────────────────────────────────────┤
    ↓                                                     │
Phase 9 (ChatKit) ────────────────────────────────────────┤
                                                          ▼
Phase 10 (Testing + Deploy) ◄─────────────────────────────┘
```

### Parallel Opportunities Per Phase

**Phase 2**: T015, T016, T017, T018 (all diagram generation) can run in parallel
**Phase 3**: T021-T023, T026-T028, T031-T034, T037-T039, T041-T043 can run in parallel
**Phase 4**: T049-T051 (Part translations) can run in parallel
**Phase 7**: T073-T076 (API endpoints) can run in parallel after T072

---

## Subagent Summary

| # | Subagent | Tasks | Phase |
|---|----------|-------|-------|
| 1 | DocusaurusSetupAgent | T001, T002, T010 | 1 |
| 2 | TailwindConfigAgent | T003, T004, T005, T006 | 1 |
| 3 | ProjectStructureAgent | T007, T008, T009 | 1 |
| 4 | CoverImageAgent | T011, T012 | 2 |
| 5 | LogoAgent | T013, T014 | 2 |
| 6 | DiagramAgent | T015, T016, T017, T018 | 2 |
| 7 | Part1ContentAgent | T019, T020, T021, T022, T023 | 3 |
| 8 | Part2ContentAgent | T024, T025, T026, T027, T028 | 3 |
| 9 | Part3ContentAgent | T029, T030, T031, T032, T033, T034 | 3 |
| 10 | Part4ContentAgent | T035, T036, T037, T038, T039 | 3 |
| 11 | MCQAgent | T040, T041, T042, T043 | 3 |
| 12 | RTLConfigAgent | T044, T045, T046 | 4 |
| 13 | UrduTranslationAgent | T047, T048, T049, T050, T051, T052 | 4 |
| 14 | NavbarAgent | T053, T054, T055, T056, T059 | 5 |
| 15 | FooterAgent | T057, T058 | 5 |
| 16 | SignupPageAgent | T060, T061, T062 | 6 |
| 17 | LoginPageAgent | T063, T064 | 6 |
| 18 | AuthContextAgent | T065, T066, T067, T068 | 6 |
| 19 | NeonSchemaAgent | T069, T070, T071 | 7 |
| 20 | APIRoutesAgent | T072, T073, T074, T075, T076, T077 | 7 |
| 21 | PersonalizeTipsAgent | T078, T079, T080, T081 | 8 |
| 22 | ChatKitUIAgent | T082, T083, T084, T085 | 9 |
| 23 | RAGIndexAgent | T086, T087, T088 | 9 |
| 24 | ChatKitBackendAgent | T089, T090, T091 | 9 |
| 25 | TestingAgent | T092, T093, T094, T095, T096, T097, T098 | 10 |
| 26 | DeployAgent | T099, T100, T101, T102, T103, T104 | 10 |

**Total: 104 tasks across 26 subagents**

---

## Implementation Strategy

### MVP First (Phase 1-3 only)
1. Complete Setup → site runs locally
2. Complete Assets → all images ready
3. Complete Content → English textbook browsable
4. **STOP and VALIDATE**: Full MVP functional without auth

### Incremental Premium Features
5. Add Auth (Phase 6-7) → users can register
6. Add Urdu (Phase 4) → premium translation available
7. Add Tips (Phase 8) → personalization working
8. Add ChatKit (Phase 9) → RAG bot functional
9. Deploy (Phase 10) → live on Vercel

### Parallel Team Strategy
With multiple developers:
- Developer A: Phase 1 → Phase 6 → Phase 7 (Setup + Auth + DB)
- Developer B: Phase 2 → Phase 3 (Assets + Content)
- Developer C: Phase 4 → Phase 8 (Urdu + Tips)
- Developer D: Phase 5 → Phase 9 (Navigation + ChatKit)
- All: Phase 10 (Testing + Deploy)

---

## Notes

- Every task has explicit error handling
- [P] tasks can run in parallel with other [P] tasks in same phase
- Each subagent commits with format: `Subagent [Name]: completed task`
- All file paths are relative to textbook/ directory
- Test tasks (T092-T098) can be skipped for faster initial deployment, added later
