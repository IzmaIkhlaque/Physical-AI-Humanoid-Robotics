# Research: Physical AI & Humanoid Robotics Textbook

**Date**: 2025-12-05
**Feature**: 001-physical-ai-textbook

## Technology Decisions

### 1. Framework: Docusaurus v3.5.2

**Decision**: Use Docusaurus v3.5.2 exactly as specified
**Rationale**:
- User mandate (FR-001)
- Constitution Principle I requires Docusaurus-only architecture
- Provides built-in i18n, MDX support, and documentation structure
**Alternatives Considered**:
- Next.js: Rejected - violates Constitution Principle I
- VitePress: Rejected - less mature i18n support
- GitBook: Rejected - limited customization

### 2. Styling: Tailwind CSS with Docusaurus

**Decision**: Integrate Tailwind CSS via PostCSS in Docusaurus
**Rationale**:
- User mandate (FR-003)
- Enables glassmorphism effects efficiently
- Responsive design utilities
- Note: Constitution mentions "unless through Docusaurus-compatible integration" - Tailwind via PostCSS qualifies
**Installation**:
```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
**Alternatives Considered**:
- Pure CSS: Rejected - more verbose for glassmorphism
- Styled Components: Rejected - additional runtime overhead

### 3. Database: Neon PostgreSQL (Serverless)

**Decision**: Use Neon PostgreSQL for user data storage
**Rationale**:
- User mandate (FR-023)
- Serverless scales to zero when unused
- PostgreSQL compatibility for robust data modeling
- Free tier sufficient for hackathon
**Connection**: Via `@neondatabase/serverless` driver
**Alternatives Considered**:
- Supabase: Rejected - more complex setup
- PlanetScale: Rejected - MySQL syntax differences
- SQLite: Rejected - not suitable for serverless deployment

### 4. Backend: FastAPI (Python)

**Decision**: Use FastAPI for authentication and API endpoints
**Rationale**:
- User specified `backend/app/main.py`
- Excellent for rapid development
- Built-in OpenAPI documentation
- Async support for AI operations
**Deployment**: Vercel Serverless Functions or separate API route
**Alternatives Considered**:
- Express.js: Viable but user specified Python
- Hono: Less ecosystem support

### 5. Authentication: Custom JWT Implementation

**Decision**: Build custom JWT-based authentication
**Rationale**:
- Constitution Principle III requires custom auth (no third-party providers)
- JWT allows stateless verification
- Works well with Vercel serverless
**Flow**:
1. User signs up → credentials + preferences stored in Neon
2. Login → JWT issued with user ID and level
3. Frontend stores JWT in httpOnly cookie or localStorage
4. Protected routes verify JWT on each request
**Alternatives Considered**:
- Auth0/Clerk: Rejected - Constitution prohibits third-party auth
- Session cookies only: Rejected - less flexible for API calls

### 6. Vector Database: Qdrant (Cloud)

**Decision**: Use Qdrant Cloud for RAG functionality
**Rationale**:
- Assumption #2 from spec mentions Qdrant
- Free tier available
- Excellent Python SDK
- Fast similarity search
**Integration**: Index all lesson content as embeddings
**Alternatives Considered**:
- Pinecone: Similar capability, Qdrant specified in assumptions
- Chroma: Less production-ready for cloud deployment
- pgvector: Would add complexity to Neon setup

### 7. AI Embeddings & Chat: OpenAI API

**Decision**: Use OpenAI for embeddings and chat completions
**Rationale**:
- Assumption #3 specifies OpenAI API
- text-embedding-3-small for cost-effective embeddings
- gpt-4o-mini for chat responses (fast, affordable)
**Rate Limiting**: Implement per-user rate limiting (10 queries/minute)
**Alternatives Considered**:
- Anthropic Claude: Could work but OpenAI specified
- Local models: Too slow for real-time chat

### 8. Image Generation: AI Image Tools

**Decision**: Generate images using DALL-E 3 or similar
**Rationale**:
- Constitution Principle II requires AI-generated content
- Need 1 book cover (1200×630) + 1 logo + 30+ diagrams
**Approach**:
- Book cover: DALL-E 3 with specific prompt for robotics theme
- Logo: Simple text-based or icon generation
- Diagrams: SVG generation via Claude or Mermaid.js for technical diagrams
**Storage**: Static assets in `/static/img/`

### 9. i18n: Docusaurus Built-in

**Decision**: Use Docusaurus i18n plugin exclusively
**Rationale**:
- Constitution Principle I and FR-004/FR-019 prohibit external translation APIs
- Docusaurus i18n is file-based, perfect for AI-generated translations
**Structure**:
```
i18n/
└── ur/
    └── docusaurus-plugin-content-docs/
        └── current/
            └── [mirror of docs/]
```
**Font**: Noto Nastaliq Urdu via Google Fonts

### 10. Toast Notifications: React-Toastify

**Decision**: Use react-toastify for all notifications
**Rationale**:
- FR-044 specifies "Toastify-style"
- Well-maintained, customizable
- Works with Docusaurus React components
**Alternatives Considered**:
- Custom toast: More work, less polished
- Sonner: Newer but less documentation

### 11. Deployment: Vercel

**Decision**: Deploy to Vercel
**Rationale**:
- User mandate (FR-048)
- Excellent Docusaurus support
- Serverless functions for backend API
- Free tier sufficient
**Configuration**:
- Static site for Docusaurus
- API routes for backend endpoints

### 12. Testing: Pytest + Playwright

**Decision**: Pytest for backend, Playwright for E2E
**Rationale**:
- FR-045 requires tests for login redirect
- Pytest aligns with FastAPI backend
- Playwright for browser-based E2E tests
**Coverage Focus**:
- Authentication flows
- Premium feature gating
- Link validation

## Subagent Architecture

### 25+ Claude Subagents by Phase

Based on user requirements, here are the designated subagents:

**Phase 1: Setup (3 subagents)**
1. **DocusaurusSetupAgent**: Initialize Docusaurus 3.5.2 with TypeScript
2. **TailwindConfigAgent**: Configure Tailwind with glassmorphism
3. **ProjectStructureAgent**: Create folder structure

**Phase 2: Assets (3 subagents)**
4. **CoverImageAgent**: Generate book cover 1200×630
5. **LogoAgent**: Generate logo and favicon
6. **DiagramAgent**: Generate 30+ technical diagrams

**Phase 3: English Content (5 subagents)**
7. **Part1ContentAgent**: Generate Part 1 (4 chapters × 5 lessons)
8. **Part2ContentAgent**: Generate Part 2 (4 chapters × 6 lessons)
9. **Part3ContentAgent**: Generate Part 3 (5 chapters × 5 lessons)
10. **Part4ContentAgent**: Generate Part 4 (4 chapters × 7 lessons)
11. **MCQAgent**: Generate MCQs for all lessons

**Phase 4: Urdu Translation (2 subagents)**
12. **UrduTranslationAgent**: Translate all lessons to Urdu
13. **RTLConfigAgent**: Configure RTL and Noto Nastaliq font

**Phase 5: Navigation (2 subagents)**
14. **NavbarAgent**: Build responsive navbar with auth state
15. **FooterAgent**: Build responsive footer

**Phase 6: Authentication (3 subagents)**
16. **SignupPageAgent**: Create signup with level/hardware questions
17. **LoginPageAgent**: Create login page
18. **AuthContextAgent**: Implement auth state management

**Phase 7: Database (2 subagents)**
19. **NeonSchemaAgent**: Create database schema
20. **APIRoutesAgent**: Implement FastAPI endpoints

**Phase 8: Personalization (1 subagent)**
21. **PersonalizeTipsAgent**: Build tips overlay component

**Phase 9: ChatKit (3 subagents)**
22. **ChatKitUIAgent**: Build floating chat panel
23. **RAGIndexAgent**: Index content in Qdrant
24. **ChatKitBackendAgent**: Implement RAG query endpoint

**Phase 10: Final (2 subagents)**
25. **TestingAgent**: Write and run all tests
26. **DeployAgent**: Configure and deploy to Vercel

## Error Handling Strategy

### Per-Phase Error Handling

| Phase | Potential Errors | Handling Strategy |
|-------|-----------------|-------------------|
| 1. Setup | npm/pnpm conflicts | Clean install with `rm -rf node_modules` |
| 2. Assets | Image generation failures | Retry with fallback prompts, use placeholder |
| 3. Content | Content too short/long | Re-generate with adjusted word count prompt |
| 4. Urdu | RTL layout breaks | Test each page, fix CSS conflicts |
| 5. Navigation | Mobile menu issues | Test all breakpoints, add fallbacks |
| 6. Auth | Token validation errors | Implement proper error responses, refresh tokens |
| 7. Database | Connection failures | Connection pooling, retry logic |
| 8. Tips | Level not found | Default to Beginner level |
| 9. ChatKit | API rate limits | Queue requests, show loading states |
| 10. Deploy | Build failures | Fix incrementally, check build logs |

### Global Error Handling

1. **React ErrorBoundary**: Wrap all routes
2. **Toast Notifications**: User-friendly error messages
3. **Logging**: Console in dev, structured logs in prod
4. **Graceful Degradation**: Premium features fail silently for unauthenticated users

## Research Validation

All technology decisions align with:
- ✅ Constitution Principle I (Docusaurus-only with compatible integrations)
- ✅ Constitution Principle II (AI-generated content)
- ✅ Constitution Principle III (Custom auth)
- ✅ Constitution Principle IV (Neon PostgreSQL)
- ✅ Constitution Principle V (Navy blue theme, glassmorphism)
- ✅ Constitution Principle VI (Zero-error deployment)
- ✅ Constitution Principle VII (Built-in i18n)
- ✅ Constitution Principle VIII (Performance targets)
