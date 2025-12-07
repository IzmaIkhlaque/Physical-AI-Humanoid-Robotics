<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution creation)

Modified principles: None (initial creation)

Added sections:
- Core Principles (8 principles)
- Technology Stack Constraints
- Development Workflow
- Governance

Removed sections: None (initial creation)

Templates requiring updates:
- ✅ plan-template.md (Constitution Check section will reference these principles)
- ✅ spec-template.md (Aligned with user story approach)
- ✅ tasks-template.md (Aligned with phased approach)

Follow-up TODOs: None
-->

# Izma's Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Docusaurus-Only Architecture

The entire textbook website MUST be built exclusively using Docusaurus v3.5.2. No external frameworks, component libraries, or third-party UI kits are permitted. All custom functionality MUST be implemented through:
- Native Docusaurus plugins and theming system
- React components within Docusaurus architecture
- Docusaurus built-in i18n for Urdu language support
- MDX for content with embedded components

**Rationale**: Ensures consistency, reduces dependency conflicts, and maintains a single source of truth for the build system.

### II. AI-Generated Content Mandate

100% of all content MUST be AI-generated using 25+ Claude subagents. This includes:
- All textbook chapters and educational content
- Book cover design specifications
- 30+ technical diagrams (SVG/PNG with alt text)
- Code examples and interactive demonstrations
- Urdu translations via built-in i18n (no external translation APIs)

**Rationale**: Demonstrates the power of AI-assisted content creation while maintaining consistent quality and voice throughout the textbook.

### III. Authentication-Gated Premium Features

Premium features MUST be strictly locked behind user authentication:
- ChatKit RAG bot (conversational AI for textbook Q&A)
- Urdu language switcher
- Personalized tips based on user level (Beginner/Intermediate/Advanced)

Non-authenticated users:
- MUST see only static English textbook content
- MUST receive toast notification when attempting premium feature access
- MUST be redirected to login page for premium feature attempts

**Rationale**: Creates clear value proposition for registration while ensuring free access to core educational content.

### IV. User Data Collection Requirements

During signup, the system MUST collect:
1. **User Level** (required): Dropdown with options Beginner / Intermediate / Advanced
2. **Hardware Access** (optional): Free-text field for describing available robotics hardware

All user data MUST be stored in Neon PostgreSQL with proper data validation and sanitization.

**Rationale**: Enables personalized learning experience while keeping signup friction minimal.

### V. Design System Compliance

All UI elements MUST adhere to the following design specifications:
- **Primary color**: Navy blue (#001F3F)
- **Secondary color**: Black (#000000)
- **Visual effects**: Glassmorphism blur effects for cards and overlays
- **Responsiveness**: Fully responsive navbar and footer across all breakpoints
- **Typography**: Clear hierarchy for educational content readability

**Rationale**: Establishes professional, cohesive visual identity that enhances learning experience.

### VI. Zero-Error Deployment Standard

The deployed application MUST meet these quality gates:
- Zero build errors
- Zero runtime console errors
- Zero broken links (internal and external)
- Successful Vercel deployment
- Demo video under 90 seconds demonstrating all key features

**Rationale**: Ensures production-ready quality for hackathon submission.

### VII. Accessibility and Internationalization

Content MUST be accessible and support multiple languages:
- All images MUST have descriptive alt text
- Semantic HTML structure for screen readers
- Keyboard navigation support
- Docusaurus built-in i18n for English (default) and Urdu
- RTL (right-to-left) support for Urdu content

**Rationale**: Educational content should be accessible to all users regardless of ability or language preference.

### VIII. Performance and Security

The application MUST meet these non-functional requirements:
- Page load time under 3 seconds on 3G connection
- Lighthouse performance score above 80
- No exposed secrets or API keys in client code
- Secure authentication flow with proper session management
- Environment variables for all sensitive configuration

**Rationale**: Ensures professional-grade application suitable for production deployment.

## Technology Stack Constraints

**Framework**: Docusaurus v3.5.2 (MUST NOT deviate)
**Database**: Neon PostgreSQL (serverless)
**Deployment**: Vercel
**Authentication**: Custom implementation within Docusaurus
**Styling**: CSS Modules or Docusaurus theming (glassmorphism effects via CSS)
**Content Format**: MDX with React components
**Version Control**: Git with meaningful commit messages
**AI Tooling**: 25+ Claude subagents for content generation

### Prohibited Technologies
- External CSS frameworks (Bootstrap, Tailwind, etc.) unless through Docusaurus-compatible integration
- External translation APIs (use built-in i18n only)
- Third-party authentication providers (build custom)
- Server-side rendering frameworks outside Docusaurus

## Development Workflow

### Content Generation Process
1. Define chapter outline and learning objectives
2. Deploy Claude subagent for content generation
3. Review and refine generated content
4. Generate supporting diagrams via AI
5. Add interactive MDX components
6. Generate Urdu translations via i18n workflow
7. Test accessibility compliance

### Feature Implementation Process
1. Verify alignment with Constitution principles
2. Create feature specification
3. Implement with smallest viable change
4. Test across all breakpoints
5. Verify authentication gates work correctly
6. Deploy to staging for review
7. Merge to main and deploy to production

### Quality Gates
- [ ] All premium features gated behind authentication
- [ ] Toast notifications display for non-authenticated premium access
- [ ] Urdu translation available for all public content
- [ ] All diagrams have alt text
- [ ] No console errors in production build
- [ ] Lighthouse score above 80
- [ ] Demo video under 90 seconds

## Governance

This Constitution is the authoritative source for all architectural and development decisions for the Physical AI & Humanoid Robotics Textbook project.

### Amendment Process
1. Propose change with rationale and impact assessment
2. Document in Architecture Decision Record (ADR)
3. Obtain stakeholder approval
4. Update Constitution with version increment
5. Propagate changes to dependent templates

### Version Policy
- **MAJOR**: Breaking changes to core principles or technology stack
- **MINOR**: Addition of new principles or sections
- **PATCH**: Clarifications, typo fixes, non-semantic updates

### Compliance Requirements
- All pull requests MUST verify compliance with Constitution principles
- Deviations MUST be documented and justified in ADRs
- Constitution Check in implementation plans MUST reference specific principles

**Version**: 1.0.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05
