# ✅ CORRECT Deployment Steps for Vercel

## ⚠️ IMPORTANT - Common Mistake

**DO NOT** deploy the `api/` folder separately!
**DO NOT** deploy the `textbook/` folder separately!

You must deploy the **ROOT directory** (Physical-AI-and-Humanoid-Robotic) which contains BOTH folders.

## Why This Matters

Your project structure:
```
Physical-AI-and-Humanoid-Robotic/     ← Deploy THIS directory
├── textbook/                         ← Frontend (Docusaurus)
├── api/                              ← Backend (Express API)
└── vercel.json                       ← Configuration file
```

The `vercel.json` tells Vercel to:
- Serve frontend from `/` (textbook/build/)
- Serve backend from `/api/*` (api/index.js)
- Both on the **SAME domain** (no CORS issues!)

## Step-by-Step Deployment

### Step 1: Delete Any Existing Vercel Projects

If you already deployed the `api` folder separately:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find and **DELETE** any projects for:
   - `api`
   - `textbook`
   - Any partial deployments
3. Start fresh!

### Step 2: Deploy from GitHub (Recommended)

**Option A: Via Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select: `IzmaIkhlaque/Physical-AI-Humanoid-Robotics`
4. **IMPORTANT**: Leave "Root Directory" as `./` (the root)
5. Framework Preset: **Other**
6. Build Command: Leave empty (vercel.json handles it)
7. Output Directory: `textbook/build`
8. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
# In the ROOT directory (Physical-AI-and-Humanoid-Robotic)
cd "D:\Izma folder\Governer sindh course\Q4\GEMINI_CLI\HACKATHONS\Physical-AI-and-Humanoid-Robotic"

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Add Environment Variables

**AFTER** the project is created, add these environment variables:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for **ALL environments** (Production, Preview, Development):

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_ZcMeaSGHD42k@ep-gentle-rain-a441yjww-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `QDRANT_URL` | `https://0559a8f7-9f00-4bba-90b2-cea14e58897a.sa-east-1-0.aws.cloud.qdrant.io` |
| `QDRANT_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.f47LLsj4KXyEJNWV3zPZqyesXbtTTzwyqJ-8pZ3xrmw` |
| `JWT_SECRET` | `Gb83Dnj5iZakEMgxnb+SslPTPnVyoDfQa2uRHBNiid+hXdkkN0ITy9PeTpYfh0rQ` |

3. Click "Save"

### Step 4: Redeploy (Important!)

After adding environment variables:

1. Go to: Deployments → Latest Deployment
2. Click the "..." menu → **Redeploy**
3. Wait for the build to complete

## Step 5: Verify It Works

### Test the Frontend
```
Visit: https://your-project.vercel.app
```
You should see the textbook homepage.

### Test the API
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","message":"API is running"}
```

### Test Login
1. Go to: `https://your-project.vercel.app/signup`
2. Create an account
3. Try logging in at: `https://your-project.vercel.app/login`

If login works, your backend is running correctly! ✅

## Troubleshooting

### Problem: "Not Found" when accessing /api/health

**Cause**: Vercel can't find the API handler.

**Solution**:
1. Check that `api/index.js` exists in your repository
2. Check that `vercel.json` is in the root directory
3. Make sure you deployed the ROOT, not the `api` folder
4. Redeploy after pushing latest changes

### Problem: Login doesn't work

**Cause**: Environment variables not set or API not responding.

**Solution**:
1. Check Environment Variables in Vercel Dashboard
2. Make sure all 4 variables are set
3. Redeploy after adding environment variables
4. Check Function Logs: Dashboard → Functions → api/index.js

### Problem: CORS errors in browser console

**Cause**: Frontend and backend on different domains.

**Solution**:
- Make sure both are deployed together on the same Vercel project
- Frontend should be at: `https://your-project.vercel.app`
- Backend should be at: `https://your-project.vercel.app/api/*`
- **NOT** separate domains!

### Problem: Build fails

**Check the build logs**:
1. Vercel Dashboard → Deployments → Failed Deployment
2. Look for errors in the build logs

**Common issues**:
- Missing environment variables during build
- Prisma generate failed
- npm install errors

## What Gets Deployed

```
https://your-project.vercel.app/
├── /                          → Frontend (textbook)
│   ├── /                     → Homepage
│   ├── /login                → Login page
│   ├── /signup               → Signup page
│   └── /part1/...            → Textbook content
│
└── /api/*                     → Backend (serverless API)
    ├── /api/health           → Health check
    ├── /api/auth/login       → Login endpoint
    ├── /api/auth/signup      → Signup endpoint
    ├── /api/progress         → User progress
    └── /api/bookmarks        → Bookmarks
```

All on the **SAME domain**! No CORS issues! 🎉

## Final Checklist

Before deploying, verify:

- [ ] You are deploying from the **ROOT directory**
- [ ] `vercel.json` exists in the root
- [ ] `api/index.js` exists
- [ ] `api/server.js` has serverless export
- [ ] Latest changes are pushed to GitHub
- [ ] You will add environment variables AFTER deployment

## Deploy Now!

**Delete any existing projects**, then deploy the root directory:

```bash
# Navigate to root
cd "D:\Izma folder\Governer sindh course\Q4\GEMINI_CLI\HACKATHONS\Physical-AI-and-Humanoid-Robotic"

# Push latest changes
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main

# Deploy
vercel --prod
```

Or use the Vercel Dashboard at [vercel.com/new](https://vercel.com/new)

---

**Your app will be live at**: `https://physical-ai-humanoid-robotics-<random>.vercel.app`

Both frontend AND backend will work! 🚀
