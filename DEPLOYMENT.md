# Deployment Guide - Vercel

## Quick Deploy to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (from Vercel, Supabase, or other provider)
- Gemini API key from Google AI Studio

---

## Step 1: Environment Variables

Add these to your Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your-secure-random-string-here

# AI
GEMINI_API_KEY=your-gemini-api-key-from-google

# App
NODE_ENV=production
```

---

## Step 2: Vercel Configuration

The project already has `vercel.json` configured:

```json
{
  "buildCommand": "cd textbook && npm install && npm run build",
  "outputDirectory": "textbook/build",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

---

## Step 3: Deploy

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option B: GitHub Integration
1. Push to GitHub
2. Connect repository to Vercel
3. Vercel auto-deploys on push to main branch

---

## Step 4: Database Setup

After first deployment, run database migration:

```bash
# Connect to your Vercel deployment
vercel env pull

# Run Prisma migration
cd api
npx prisma migrate deploy

# Or push schema directly
npx prisma db push
```

---

## Step 5: Verify Deployment

Test these endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Public endpoint
curl https://your-app.vercel.app/

# Test Urdu route (should redirect if not authenticated)
curl https://your-app.vercel.app/ur/
```

---

## Troubleshooting

### Build Fails
- Check Node version is 18+
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### API Routes 404
- Verify `vercel.json` rewrites configuration
- Check `/api` folder structure
- Ensure serverless functions are deployed

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database is accessible from Vercel
- Run `npx prisma db push` to sync schema

### Translation Feature Not Working
- Verify GEMINI_API_KEY is set
- Check API quota limits
- Test endpoint: `/api/translations/track-translation`

---

## Production Checklist

- ✅ Environment variables set in Vercel
- ✅ Database migrated
- ✅ Build successful
- ✅ API health check passing
- ✅ Authentication working
- ✅ Translation button visible (when logged in)
- ✅ Language switcher functional
- ✅ Chatbot responding
- ✅ Dark mode working

---

## Rollback

If deployment fails:

```bash
# Revert to previous deployment
vercel rollback
```

---

## Monitoring

### Check Logs
```bash
vercel logs
```

### Check Build
```bash
vercel inspect [deployment-url]
```

---

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connection

---

## Current Deployment

**Live URL**: https://physical-ai-humanoid-robotics-6qjj.vercel.app/

All features are working in production! 🎉
