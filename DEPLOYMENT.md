# Vercel Deployment Guide

## Prerequisites
- Vercel account
- MongoDB Atlas account (or your MongoDB connection string)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Environment Variables

### Frontend Environment Variables (in Vercel Dashboard)
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following (optional):

```
VITE_API_BASE_URL=
```

**Note:** Leave `VITE_API_BASE_URL` empty or unset for production. The app will automatically use relative URLs when deployed to Vercel (since frontend and backend are on the same domain). Only set it if you're deploying frontend and backend separately.

### Backend Environment Variables (in Vercel Dashboard)
Add these environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

## Step 2: Deployment Options

### Option A: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option B: Deploy via GitHub
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory:** Leave as root (`.`)
   - **Build Command:** `cd frontend && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install` (in root) or configure separately

6. Add all environment variables
7. Click "Deploy"

## Step 3: Update API URL After First Deployment

After your first deployment:
1. Get your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Update the `VITE_API_BASE_URL` environment variable in Vercel to use your actual URL
3. Redeploy the application

## Step 4: MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to `MONGO_URI` environment variable in Vercel

## Important Notes

- The backend will be deployed as serverless functions on Vercel
- Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel's IP addresses
- Cookies should work with `withCredentials: true` as long as CORS is properly configured
- The frontend and backend will be on the same domain, which helps with CORS and cookies

## Troubleshooting

### If API calls fail:
1. Check that `VITE_API_BASE_URL` is set correctly
2. Verify `FRONTEND_URL` matches your Vercel URL
3. Check MongoDB connection string
4. Review Vercel function logs

### If CORS errors occur:
1. Ensure `FRONTEND_URL` environment variable is set correctly
2. Check that the frontend URL matches exactly (including https://)

