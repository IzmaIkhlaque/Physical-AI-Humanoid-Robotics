# Quick Deploy to Vercel Guide

Deploy your Physical AI Textbook to Vercel in minutes with a fully working backend!

## Quick Start (3 Steps)

### 1. Push to Git Repository

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

**Option A: One-Click Deploy** (Fastest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Click "Deploy" (Vercel will auto-detect settings from `vercel.json`)

**Option B: CLI Deploy**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string | Production, Preview, Development |
| `QDRANT_URL` | Your Qdrant cluster URL | Production, Preview, Development |
| `QDRANT_API_KEY` | Your Qdrant API key | Production, Preview, Development |
| `JWT_SECRET` | Strong random string (48+ chars) | Production, Preview, Development |

**Your current values** (from `api/.env`):
- DATABASE_URL: `postgresql://neondb_owner:npg_ZcMeaSGHD42k@ep-gentle-rain-a441yjww-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- QDRANT_URL: `https://0559a8f7-9f00-4bba-90b2-cea14e58897a.sa-east-1-0.aws.cloud.qdrant.io`
- QDRANT_API_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.f47LLsj4KXyEJNWV3zPZqyesXbtTTzwyqJ-8pZ3xrmw`
- JWT_SECRET: `Gb83Dnj5iZakEMgxnb+SslPTPnVyoDfQa2uRHBNiid+hXdkkN0ITy9PeTpYfh0rQ`

## What's Deployed

✅ **Frontend**: Docusaurus static site (textbook/)
✅ **Backend**: Express.js API as serverless functions (api/)
✅ **Database**: Neon PostgreSQL (already set up)
✅ **Vector DB**: Qdrant (already set up)
✅ **Authentication**: JWT-based auth with bcrypt

## Verify Deployment

### Test Frontend
Visit: `https://your-project.vercel.app`

### Test API
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","message":"API is running"}
```

### Test Authentication
```bash
curl -X POST https://your-project.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "experienceLevel": "beginner",
    "primaryInterest": "humanoid-robots"
  }'
```

## Architecture

```
Vercel Deployment
├── Frontend (Static)
│   └── textbook/build/* → Served at /
└── Backend (Serverless)
    └── api/server.js → Served at /api/*
```

Both frontend and backend run on the **same domain**, so no CORS issues!

## Key Files

- **vercel.json** - Deployment configuration
- **api/server.js** - Backend API (modified for serverless)
- **textbook/docusaurus.config.ts** - Frontend configuration
- **.vercelignore** - Files to exclude from deployment
- **.gitignore** - Files to exclude from Git

## Automatic Features

✅ HTTPS enabled automatically
✅ CDN distribution worldwide
✅ Automatic deployments on `git push`
✅ Preview deployments for pull requests
✅ Environment variables per environment
✅ Prisma migrations on deploy

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct

### API 500 Errors
- Check function logs: Dashboard → Functions → api/server.js
- Verify database connection
- Check Prisma migrations

### CORS Errors
- Ensure frontend and API are on same domain
- Check `server.js` CORS configuration
- Verify `FRONTEND_URL` env var if using custom domain

## Next Steps

1. ✅ Deploy to Vercel
2. ⚠️ Set up custom domain (optional)
3. ⚠️ Enable error monitoring (Sentry recommended)
4. ⚠️ Set up rate limiting for API
5. ⚠️ Configure database backups in Neon

## Support

- **Full Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: Report in your Git repository

---

**That's it! Your app is now live in production! 🚀**

**URL**: `https://your-project.vercel.app`
