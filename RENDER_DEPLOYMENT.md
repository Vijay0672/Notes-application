# Render Deployment Guide

This guide will help you deploy both frontend and backend to Render.

## Prerequisites

- [ ] Render account ([sign up here](https://render.com))
- [ ] MongoDB Atlas account (or your MongoDB connection string)
- [ ] GitHub account (to connect your repository)

## Step 1: Push Your Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Setup for Render deployment"
   ```

2. Create a repository on GitHub and push:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name:** `notes-backend` (or any name you prefer)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or choose paid plan)

5. Add Environment Variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secret key for JWT tokens (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `FRONTEND_URL` - Will be your frontend URL (set after deploying frontend)
   - `NODE_ENV` - `production`

6. Click **"Create Web Service"**

7. **Important:** Copy the backend URL (e.g., `https://notes-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the frontend service:
   - **Name:** `notes-frontend` (or any name you prefer)
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add Environment Variable:
   - `VITE_API_BASE_URL` - Your backend URL from Step 2 (e.g., `https://notes-backend.onrender.com`)

5. Click **"Create Static Site"**

6. **Important:** Copy the frontend URL (e.g., `https://notes-frontend.onrender.com`)

## Step 4: Update Environment Variables

### Update Backend:
1. Go to your backend service in Render
2. Go to **Environment** tab
3. Update `FRONTEND_URL` to your frontend URL (e.g., `https://notes-frontend.onrender.com`)
4. Click **"Save Changes"**
5. Render will automatically redeploy

### Verify Frontend:
1. Go to your frontend service in Render
2. Verify `VITE_API_BASE_URL` is set correctly
3. If you need to update it, go to **Environment** tab and update

## Step 5: MongoDB Atlas Configuration

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Network Access"** in the left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0) or add Render's IP addresses
5. Click **"Confirm"**

## Environment Variables Summary

### Backend Environment Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_minimum_32_characters
FRONTEND_URL=https://your-frontend-url.onrender.com
NODE_ENV=production
```

### Frontend Environment Variables:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## How to Get Values

### 1. MONGO_URI
- Go to MongoDB Atlas → Connect → Connect your application
- Copy the connection string
- Replace `<password>` and `<dbname>`

### 2. JWT_SECRET
Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. FRONTEND_URL & VITE_API_BASE_URL
- Use the URLs Render provides after deployment
- Backend URL: `https://your-backend-name.onrender.com`
- Frontend URL: `https://your-frontend-name.onrender.com`

## Testing Your Deployment

After deployment, test these endpoints:

- Frontend: `https://your-frontend-name.onrender.com`
- Backend API: `https://your-backend-name.onrender.com/api/auth/signup`

## Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading to paid plan for always-on service

2. **Cookies & CORS:**
   - Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
   - Include `https://` in the URL
   - No trailing slashes

3. **Build Time:**
   - First deployment may take 5-10 minutes
   - Subsequent deployments are faster

4. **Environment Variables:**
   - Changes to environment variables trigger automatic redeployment
   - Wait for deployment to complete before testing

## Troubleshooting

### Backend Not Starting
- Check build logs in Render dashboard
- Verify `MONGO_URI` is correct
- Check that `package.json` has correct start script
- Verify Node.js version (Render uses Node 18.x by default)

### Frontend Build Fails
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Check that `VITE_API_BASE_URL` is set correctly

### CORS Errors
- Verify `FRONTEND_URL` in backend matches frontend URL exactly
- Check for typos in URLs
- Ensure no trailing slashes

### MongoDB Connection Errors
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check connection string format
- Verify username and password are correct

### Cookies Not Working
- Verify `withCredentials: true` in axios requests
- Check CORS configuration allows credentials
- Ensure frontend and backend URLs are correct

## Local Development

Your app still works locally:

1. **Backend**: 
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The API configuration automatically uses `http://localhost:3000` in development.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

