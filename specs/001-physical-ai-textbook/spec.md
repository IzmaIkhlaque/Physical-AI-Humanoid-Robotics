# Feature Specification: Izma's Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "Complete textbook website using Docusaurus v3.5.2 with 100% AI-generated content, premium features locked behind authentication, Urdu i18n support, and ChatKit RAG bot"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Static English Textbook (Priority: P1)

As a visitor (unauthenticated user), I want to browse the complete Physical AI & Humanoid Robotics textbook in English so that I can learn about robotics fundamentals without requiring an account.

**Why this priority**: Core value proposition - free educational content must be accessible to everyone. This is the MVP that demonstrates the textbook's quality and encourages registration for premium features.

**Independent Test**: Can be fully tested by navigating to the site, viewing all 100+ lessons across 17 chapters without logging in, and verifying all content renders correctly with diagrams and code snippets.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated visitor, **When** I navigate to the landing page, **Then** I see a hero section with book title, description, keywords, book cover image, and "Start Reading" button
2. **Given** I am on the landing page, **When** I click "Start Reading", **Then** I am navigated to Part 1 Chapter 1 Lesson 1
3. **Given** I am reading a lesson, **When** I view the content, **Then** I see a 3-bullet recap, 800-1200 words of content, examples, code snippets, activities, and a diagram
4. **Given** I am on any lesson page, **When** I look for navigation, **Then** I see "Next" and "Previous" links that work correctly
5. **Given** I am browsing the book, **When** I use the sidebar navigation, **Then** I can navigate to any Part, Chapter, or Lesson

---

### User Story 2 - User Registration with Preferences (Priority: P2)

As a visitor, I want to create an account and specify my learning level and hardware access so that I can receive personalized learning experiences.

**Why this priority**: Required before any premium features can be used. The preference data enables personalization.

**Independent Test**: Can be fully tested by completing the signup flow, verifying data is stored, and confirming the user can log in afterwards.

**Acceptance Scenarios**:

1. **Given** I am on the signup page, **When** I view the form, **Then** I see email, password fields, a required "Level" dropdown (Beginner/Intermediate/Advanced), and an optional "Hardware Access" text field
2. **Given** I fill out the signup form with valid data, **When** I submit, **Then** my account is created and preferences are stored
3. **Given** I have an account, **When** I log in, **Then** I am authenticated and can access premium features
4. **Given** I try to sign up with an existing email, **When** I submit, **Then** I see an appropriate error message
5. **Given** I am logged in, **When** I view my profile, **Then** I can see and update my level and hardware access preferences

---

### User Story 3 - Premium Feature Access Gate (Priority: P3)

As a visitor attempting to access premium features, I want to be notified that login is required and redirected to the login page so that I understand how to unlock these features.

**Why this priority**: Essential UX for the freemium model - clear communication about what requires authentication.

**Independent Test**: Can be fully tested by clicking on ChatKit, Urdu switcher, or Personalize button while unauthenticated and verifying toast + redirect behavior.

**Acceptance Scenarios**:

1. **Given** I am unauthenticated, **When** I click the ChatKit floating button, **Then** I see a toast notification "Login required to access AI assistant" and am redirected to /login
2. **Given** I am unauthenticated, **When** I attempt to switch to Urdu language, **Then** I see a toast notification "Login required for Urdu translation" and am redirected to /login
3. **Given** I am unauthenticated, **When** I click the Personalize Tips button, **Then** I see a toast notification "Login required for personalized tips" and am redirected to /login
4. **Given** I am unauthenticated, **When** I view the header, **Then** the Urdu language switcher is NOT visible
5. **Given** I am authenticated, **When** I view the header, **Then** the Urdu language switcher IS visible

---

### User Story 4 - Urdu Language Support (Priority: P4)

As an authenticated Urdu-speaking user, I want to switch the entire textbook to Urdu so that I can learn in my native language.

**Why this priority**: Major premium feature providing value to Urdu-speaking audience, significant content investment.

**Independent Test**: Can be fully tested by logging in, switching to Urdu, and navigating through lessons to verify Urdu content renders correctly with RTL layout.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I click the language switcher in the header, **Then** I can choose between English and Urdu
2. **Given** I select Urdu, **When** the page reloads, **Then** all textbook content displays in Urdu with Noto Nastaliq Urdu font
3. **Given** I am viewing Urdu content, **When** I look at the layout, **Then** the text is rendered right-to-left (RTL)
4. **Given** I am in Urdu mode, **When** I navigate between lessons, **Then** all lessons display in Urdu
5. **Given** I switch back to English, **When** the page reloads, **Then** all content displays in English with LTR layout

---

### User Story 5 - Personalized Learning Tips (Priority: P5)

As an authenticated user, I want to see personalized tips based on my learning level so that I receive guidance appropriate to my experience.

**Why this priority**: Differentiating premium feature that leverages collected user data for personalization.

**Independent Test**: Can be fully tested by logging in as users with different levels (Beginner/Intermediate/Advanced) and verifying different tip content appears.

**Acceptance Scenarios**:

1. **Given** I am logged in as a Beginner, **When** I click the Personalize Tips button, **Then** I see an overlay with beginner-appropriate tips (foundational concepts, encouragement, basic terminology explanations)
2. **Given** I am logged in as Intermediate, **When** I click the Personalize Tips button, **Then** I see intermediate tips (deeper concepts, practical applications, project suggestions)
3. **Given** I am logged in as Advanced, **When** I click the Personalize Tips button, **Then** I see advanced tips (cutting-edge research, optimization techniques, professional applications)
4. **Given** I have specified hardware in my profile, **When** I view tips, **Then** the tips reference my available hardware when relevant
5. **Given** I am viewing tips, **When** I click outside the overlay or the close button, **Then** the overlay closes

---

### User Story 6 - ChatKit RAG Bot Interaction (Priority: P6)

As an authenticated user, I want to ask questions about the textbook content and receive AI-generated answers based on the book so that I can get help understanding difficult concepts.

**Why this priority**: High-value premium feature but requires more complex infrastructure (vector database, AI integration).

**Independent Test**: Can be fully tested by logging in, asking questions about textbook topics, and verifying answers are relevant and sourced from book content.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I click the floating ChatKit button (bottom-right), **Then** the chat panel opens
2. **Given** the chat panel is open, **When** I type a question and submit, **Then** I receive an answer from "AI Robotics Guide" based on textbook content
3. **Given** I am reading a lesson, **When** I select text and the chat opens, **Then** the selected text appears in the input field
4. **Given** I ask a question unrelated to robotics, **When** the AI responds, **Then** it politely indicates the question is outside the textbook scope
5. **Given** the chat panel is open, **When** I click the close button, **Then** the panel closes
6. **Given** I am unauthenticated, **When** I look for the ChatKit button, **Then** it is NOT visible on the page

---

### User Story 7 - Responsive Navigation Experience (Priority: P7)

As any user (authenticated or not), I want the website to work well on any device so that I can learn on desktop, tablet, or mobile.

**Why this priority**: Essential for accessibility but comes after core content and features are established.

**Independent Test**: Can be fully tested by resizing browser or using mobile devices and verifying all UI elements remain functional and readable.

**Acceptance Scenarios**:

1. **Given** I am on any page, **When** I view on desktop (>1024px), **Then** I see full navbar with logo, title, GitHub icon, theme toggle, and (if logged in) language switcher
2. **Given** I am on any page, **When** I view on mobile (<768px), **Then** I see a hamburger menu that expands to show navigation options
3. **Given** I am reading a lesson on mobile, **When** I view the content, **Then** diagrams and code snippets are responsive and readable
4. **Given** I am on any page, **When** I scroll to the footer, **Then** the footer displays properly on all screen sizes
5. **Given** I am using the theme toggle, **When** I switch between light and dark mode, **Then** the entire site updates with appropriate colors and the glassmorphism effects are visible

---

### Edge Cases

- What happens when a user tries to access a non-existent lesson URL? → 404 page with navigation back to book
- How does system handle network errors during ChatKit queries? → Toast notification with retry option
- What happens when user session expires while reading? → Silent re-authentication or prompt to log in again
- How does the system handle empty or very long hardware access descriptions? → Validate max 500 characters, allow empty
- What happens if Urdu translation is missing for a specific lesson? → Fall back to English with notification
- How does the system handle concurrent logins from multiple devices? → Allow multiple sessions, most recent takes preference for settings

## Requirements *(mandatory)*

### Functional Requirements

**Project Setup**
- **FR-001**: System MUST be built using Docusaurus version 3.5.2 exactly (installed via `npx create-docusaurus@3.5.2 textbook classic --typescript`)
- **FR-002**: System MUST use pnpm as the package manager (after removing node_modules and package-lock.json)
- **FR-003**: System MUST include Tailwind CSS for styling with glassmorphism effects
- **FR-004**: System MUST NOT use any external translation APIs (Google Translate, DeepL, LibreTranslate)

**Landing Page**
- **FR-005**: Landing page MUST display a hero section with book title "Izma's Physical AI & Humanoid Robotics Textbook"
- **FR-006**: Landing page MUST show a 2-paragraph description of the book
- **FR-007**: Landing page MUST display a keywords list with relevant emojis
- **FR-008**: Landing page MUST show an AI-generated book cover image (1200×630 PNG)
- **FR-009**: Landing page MUST have a "Start Reading" button linking to Part 1
- **FR-010**: Header MUST display logo on the left with "Izma's Textbook" title
- **FR-011**: Header MUST display GitHub icon and theme toggle on the right
- **FR-012**: Header MUST display language switcher ONLY for authenticated users

**Book Content Structure**
- **FR-013**: Book MUST have exactly 4 Parts with the following structure:
  - Part 1: 4 Chapters × 5 lessons each = 20 lessons
  - Part 2: 4 Chapters × 6 lessons each = 24 lessons
  - Part 3: 5 Chapters × 5 lessons each = 25 lessons
  - Part 4: 4 Chapters × 7 lessons each = 28 lessons
  - Total: 97+ lessons (100+ with intro/summary pages)
- **FR-014**: Each lesson MUST contain:
  - 3-bullet recap of previous lesson (except first lesson)
  - 800-1200 words of beginner-friendly content
  - Real-world examples and code snippets
  - 1-2 learning activities
  - 1 diagram (stored in /static/img/)
  - 10 optional MCQs at the end
  - Navigation links to next/previous lessons
- **FR-015**: All content MUST be 100% AI-generated using 25+ Claude subagents

**Urdu Translation**
- **FR-016**: System MUST provide complete Urdu translation in /i18n/ur/docs/ mirroring the English /docs/ structure
- **FR-017**: Urdu content MUST use Noto Nastaliq Urdu font
- **FR-018**: Urdu content MUST render in RTL (right-to-left) direction
- **FR-019**: Translation MUST use only Docusaurus built-in i18n system

**Authentication & User Preferences**
- **FR-020**: Signup form MUST collect email and password
- **FR-021**: Signup form MUST include a required "Level" dropdown with options: Beginner, Intermediate, Advanced
- **FR-022**: Signup form MUST include an optional "Hardware Access" text field
- **FR-023**: User preferences MUST be stored in a PostgreSQL database (Neon)
- **FR-024**: System MUST support login and logout functionality
- **FR-025**: System MUST persist authentication state across browser sessions

**Premium Feature Gating**
- **FR-026**: ChatKit RAG bot MUST be visible ONLY to authenticated users
- **FR-027**: Urdu language switcher MUST be visible ONLY to authenticated users
- **FR-028**: Personalized tips button MUST be functional ONLY for authenticated users
- **FR-029**: Unauthenticated users attempting premium features MUST see a toast notification
- **FR-030**: Unauthenticated users MUST be redirected to /login after toast notification

**Personalized Tips**
- **FR-031**: Tips MUST vary based on user's selected level (Beginner/Intermediate/Advanced)
- **FR-032**: Tips MUST be displayed in an overlay panel when activated
- **FR-033**: Tips MAY reference user's specified hardware when relevant

**ChatKit RAG Bot**
- **FR-034**: ChatKit MUST appear as a floating button in the bottom-right corner
- **FR-035**: ChatKit MUST support text selection to auto-populate questions
- **FR-036**: Bot MUST be named "AI Robotics Guide"
- **FR-037**: Bot responses MUST be sourced only from textbook content
- **FR-038**: Bot MUST use a vector database for content retrieval

**Visual Design**
- **FR-039**: Color scheme MUST use Navy blue (#001F3F) as primary color
- **FR-040**: Color scheme MUST use Black (#000000) as secondary color
- **FR-041**: UI MUST implement glassmorphism blur effects for cards and overlays
- **FR-042**: All images MUST have descriptive alt text

**Error Handling**
- **FR-043**: System MUST wrap navigation in React ErrorBoundary
- **FR-044**: System MUST use toast notifications (Toastify-style) for all user-facing errors
- **FR-045**: System MUST include tests for login redirect functionality

**Subagent Architecture**
- **FR-046**: System MUST be built using minimum 25 different Claude subagents
- **FR-047**: Each subagent MUST make its own commit with message format "Subagent [Name]: completed task"

**Deployment**
- **FR-048**: System MUST deploy successfully to Vercel
- **FR-049**: System MUST have zero build errors
- **FR-050**: System MUST have zero broken internal or external links
- **FR-051**: A demo video under 90 seconds MUST be created

### Key Entities

- **User**: Represents a registered user with email, hashed password, authentication tokens, created timestamp
- **UserPreference**: Stores user learning preferences - level (enum: Beginner/Intermediate/Advanced), hardware_access (optional text), linked to User
- **Lesson**: Represents a single lesson with part number, chapter number, lesson number, English content, Urdu content, associated diagram path
- **ChatMessage**: Represents a conversation exchange with user ID, timestamp, user question, AI response, context used
- **Part**: Logical grouping of chapters (1-4)
- **Chapter**: Logical grouping of lessons within a part

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of textbook content (97+ lessons) accessible without authentication
- **SC-002**: All 30+ diagrams display correctly with alt text on all screen sizes
- **SC-003**: Users can navigate from landing page to any lesson in under 3 clicks
- **SC-004**: Signup process completes in under 2 minutes including preference selection
- **SC-005**: Urdu content displays correctly with RTL layout and proper Nastaliq font rendering
- **SC-006**: ChatKit AI responds to questions within 5 seconds
- **SC-007**: ChatKit responses are relevant to asked questions 90% of the time (sourced from textbook)
- **SC-008**: Unauthenticated premium feature attempts show toast and redirect within 1 second
- **SC-009**: Site achieves Lighthouse performance score above 80
- **SC-010**: Site loads completely within 3 seconds on standard broadband connection
- **SC-011**: All navigation elements remain functional on viewports from 320px to 2560px width
- **SC-012**: Zero broken links verified across entire site
- **SC-013**: Zero console errors in production build
- **SC-014**: 25+ distinct subagent commits visible in git history
- **SC-015**: Demo video under 90 seconds showcases all major features
- **SC-016**: Successful deployment to Vercel with passing build

## Assumptions

1. **Neon PostgreSQL**: A Neon database instance will be provisioned and connection credentials will be provided via environment variables
2. **Vector Database**: Qdrant will be used for ChatKit RAG functionality with OpenAI embeddings
3. **OpenAI API**: An OpenAI API key will be provided for ChatKit responses
4. **Domain**: Initial deployment will use Vercel's default domain (custom domain optional)
5. **Image Generation**: Book cover and diagrams will be generated using AI image generation tools and stored as static assets
6. **Session Management**: Standard JWT or session-based authentication will be used
7. **Email Verification**: Email verification during signup is optional (can be added later)
8. **Password Requirements**: Standard password requirements (minimum 8 characters) will be enforced
9. **Rate Limiting**: ChatKit will have reasonable rate limiting to prevent abuse
10. **Content Scope**: Textbook covers Physical AI and Humanoid Robotics fundamentals appropriate for beginners to advanced learners

## Out of Scope

1. Payment processing or subscription billing
2. Social login (Google, GitHub, etc.) - email/password only
3. User forums or discussion boards
4. Video content or multimedia lessons
5. Mobile native applications (web-only)
6. Offline mode or PWA functionality
7. Multiple user roles (admin, moderator) - all users are equal
8. Content management system for non-technical editors
9. Analytics dashboard or admin panel
10. Email notifications or newsletters
