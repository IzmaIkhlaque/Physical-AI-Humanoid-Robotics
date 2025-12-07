# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

Get the textbook running locally in under 10 minutes.

## Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher (`npm install -g pnpm`)
- Python 3.11 (for backend)
- Git

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/physical-ai-textbook.git
cd physical-ai-textbook

# Install frontend dependencies
cd textbook
pnpm install

# Install backend dependencies
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables

Create `.env` files:

**textbook/.env.local** (frontend):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**backend/.env** (backend):
```env
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/textbook
JWT_SECRET=your-super-secret-key-at-least-32-chars
OPENAI_API_KEY=sk-your-openai-api-key
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key
```

### 3. Database Setup

```bash
# Connect to Neon and run schema
psql $DATABASE_URL -f backend/db/schema.sql
```

### 4. Start Development Servers

**Terminal 1 - Frontend**:
```bash
cd textbook
pnpm start
# Opens http://localhost:3000
```

**Terminal 2 - Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
# API at http://localhost:8000
```

## Verify Installation

1. Open http://localhost:3000 - Landing page loads
2. Click "Start Reading" - Navigates to Part 1
3. Try signup at /signup - Creates account
4. Login and check:
   - Language switcher appears in navbar
   - Personalize Tips button works
   - ChatKit floating button visible

## Common Issues

### pnpm not found
```bash
npm install -g pnpm
```

### Tailwind styles not loading
```bash
cd textbook
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Database connection error
- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection string
- Ensure IP is allowed in Neon settings

### ChatKit not responding
- Verify `OPENAI_API_KEY` is valid
- Check Qdrant connection
- Run `python backend/scripts/index_content.py` to index lessons

## Development Commands

```bash
# Frontend
pnpm start          # Start dev server
pnpm build          # Production build
pnpm serve          # Serve production build
pnpm clear          # Clear cache

# Backend
pytest              # Run tests
uvicorn app.main:app --reload  # Dev server

# Urdu locale
pnpm run write-translations    # Extract strings
pnpm run start -- --locale ur  # Test Urdu
```

## Project Structure Overview

```
physical-ai-textbook/
├── textbook/                 # Docusaurus frontend
│   ├── docs/                 # English lessons
│   ├── i18n/ur/             # Urdu translations
│   ├── src/components/      # React components
│   └── static/img/          # Images and diagrams
│
├── backend/                  # FastAPI backend
│   ├── app/                  # API routes
│   └── db/                   # Database files
│
└── specs/                    # Feature specifications
```

## Next Steps

1. Read the [Implementation Plan](./plan.md) for full architecture
2. Check [API Contracts](./contracts/openapi.yaml) for endpoint details
3. Review [Data Model](./data-model.md) for database schema
