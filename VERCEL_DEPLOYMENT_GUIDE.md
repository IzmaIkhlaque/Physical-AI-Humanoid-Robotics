# Vercel Deployment Guide

This guide will help you deploy your Physical AI Textbook project to Vercel with a fully working backend API.

## Project Structure

```
Physical-AI-and-Humanoid-Robotic/
├── textbook/          # Docusaurus frontend (static site)
│   ├── build/        # Production build output
│   └── package.json
├── api/              # Express.js backend (serverless)
│   ├── server.js     # Main API server
│   ├── prisma/       # Database schema
│   └── package.json
└── vercel.json       # Vercel configuration
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm install -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, Bitbucket)

## Step 1: Prepare Your Environment Variables

You need to add these environment variables to Vercel. These are currently in your `api/.env` file:

### Required Environment Variables:

1. **DATABASE_URL** - Your Neon PostgreSQL connection string
   ```
   postgresql://neondb_owner:npg_ZcMeaSGHD42k@ep-gentle-rain-a441yjww-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. **QDRANT_URL** - Your Qdrant vector database URL
   ```
   https://0559a8f7-9f00-4bba-90b2-cea14e58897a.sa-east-1-0.aws.cloud.qdrant.io
   ```

3. **QDRANT_API_KEY** - Your Qdrant API key
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.f47LLsj4KXyEJNWV3zPZqyesXbtTTzwyqJ-8pZ3xrmw
   ```

4. **JWT_SECRET** - Your JWT secret for authentication
   ```
   Gb83Dnj5iZakEMgxnb+SslPTPnVyoDfQa2uRHBNiid+hXdkkN0ITy9PeTpYfh0rQ
   ```

5. **FRONTEND_URL** (optional) - Your production frontend URL
   ```
   https://your-project.vercel.app
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: [vercel.com/new](https://vercel.com/new)

2. **Import Your Git Repository**:
   - Click "Add New Project"
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Select this repository

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: Vercel will auto-detect from `vercel.json`
   - **Output Directory**: `textbook/build` (auto-detected)

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable from Step 1:
     - Variable name: `DATABASE_URL`
     - Value: `<your-database-url>`
     - Environment: Production, Preview, Development (check all)
   - Repeat for all variables

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (~2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add QDRANT_URL
   vercel env add QDRANT_API_KEY
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

### Test the Frontend
1. Visit your deployment URL: `https://your-project.vercel.app`
2. You should see the Docusaurus textbook homepage

### Test the API
1. Test the health endpoint:
   ```bash
   curl https://your-project.vercel.app/api/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "message": "API is running"
   }
   ```

2. Test authentication:
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "testpassword123",
       "experienceLevel": "beginner",
       "primaryInterest": "humanoid-robots"
     }'
   ```

## Step 4: Update Frontend API URL

If your frontend code has hardcoded API URLs (like `http://localhost:5000`), you'll need to update them to use the production URL:

1. **Find API URL references** in your frontend code (usually in `textbook/src/`)
2. **Update to use environment variables** or the production URL:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'https://your-project.vercel.app/api';
   ```

3. **Redeploy** if you made changes:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```
   Vercel will auto-deploy on push.

## Step 5: Database Migrations

Your Prisma database should already be set up with your Neon PostgreSQL. If you need to run migrations in production:

1. **Locally, generate a migration**:
   ```bash
   cd api
   npx prisma migrate dev --name your_migration_name
   ```

2. **Push migration to Vercel**:
   - Commit the migration files to Git
   - Push to your repository
   - Vercel will automatically run `prisma migrate deploy` during build (configured in `package.json`)

## Troubleshooting

### API Not Working

1. **Check Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure all variables are set for "Production"

2. **Check Function Logs**:
   - Vercel Dashboard → Your Project → Deployments → Latest Deployment → Functions
   - Click on `api/server.js` to see logs

3. **Check CORS Issues**:
   - The `server.js` has been updated to allow Vercel domains
   - If you have a custom domain, add it to `FRONTEND_URL` environment variable

### Build Failures

1. **Check Build Logs**:
   - Vercel Dashboard → Your Project → Deployments → Failed Deployment
   - Look for errors in the build logs

2. **Common Issues**:
   - **Prisma Generate Failed**: Ensure `DATABASE_URL` is set
   - **Node Version**: Project requires Node 18+ (configured in `textbook/package.json`)
   - **Memory Issues**: Increase function memory in `vercel.json` if needed

### Database Connection Issues

1. **Verify Neon Database**:
   - Go to [Neon Console](https://console.neon.tech)
   - Check that your database is active
   - Verify the connection string

2. **Connection Pooling**:
   - Your DATABASE_URL already uses `-pooler` for connection pooling
   - This is required for serverless environments

## Performance Optimization

### Enable Caching

Add caching headers for static assets in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Database Query Optimization

- Use Prisma's connection pooling (already configured)
- Consider implementing Redis caching for frequently accessed data
- Use database indexes (already defined in `schema.prisma`)

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `FRONTEND_URL` environment variable with your custom domain

## Monitoring

1. **Vercel Analytics**: Automatically enabled for deployment metrics
2. **Function Logs**: Available in Vercel Dashboard
3. **Error Tracking**: Consider integrating Sentry or similar service

## Security Checklist

- ✅ Environment variables are set in Vercel (not committed to Git)
- ✅ JWT_SECRET is strong and unique
- ✅ Database connection uses SSL (`sslmode=require`)
- ✅ CORS is configured to allow only your domains
- ✅ Passwords are hashed with bcrypt
- ⚠️ Consider rate limiting for API endpoints
- ⚠️ Consider adding authentication middleware for sensitive endpoints

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma with Vercel**: [pris.ly/d/vercel](https://pris.ly/d/vercel)
- **GitHub Issues**: Report issues in your repository

## Next Steps

1. **Set up monitoring** with error tracking
2. **Configure custom domain** for production
3. **Set up CI/CD** for automated testing before deployment
4. **Implement rate limiting** for API endpoints
5. **Add error monitoring** with Sentry or similar
6. **Set up database backups** in Neon

---

**Your project is now deployed and ready for production! 🚀**

Frontend: `https://your-project.vercel.app`
API: `https://your-project.vercel.app/api`
