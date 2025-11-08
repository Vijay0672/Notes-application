# Render Backend Troubleshooting Guide

## Your URLs:
- **Frontend:** https://notes-application-frontend-tvp1.onrender.com
- **Backend:** https://notes-application-backend-aj15.onrender.com

## Step-by-Step Troubleshooting

### Step 1: Check Backend Environment Variables

Go to Render → Your Backend Service → **Environment** tab

**Required Variables:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_key_here
FRONTEND_URL=https://notes-application-frontend-tvp1.onrender.com
NODE_ENV=production
```

**Action:** Add/update these variables, then click "Save Changes" (this will trigger a redeploy)

---

### Step 2: Check Backend Service Settings

Go to Render → Your Backend Service → **Settings** tab

**Verify:**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** Should be 18.x or 20.x

**Action:** If any are wrong, update and save

---

### Step 3: Check Build/Deploy Logs

Go to Render → Your Backend Service → **Logs** tab

**Look for:**
- ✅ "Connected to mongoDB" - Good sign
- ✅ "Server is running on port XXXX" - Good sign
- ❌ "MongoServerError" - MongoDB connection issue
- ❌ "Cannot find module" - Missing dependency
- ❌ "EADDRINUSE" - Port conflict
- ❌ Build errors

**Action:** Copy any error messages and check below for solutions

---

### Step 4: Test Backend Directly

Try accessing these URLs in your browser:

1. **Health Check:**
   ```
   https://notes-application-backend-aj15.onrender.com
   ```
   Should show something (even an error page means it's running)

2. **API Endpoint:**
   ```
   https://notes-application-backend-aj15.onrender.com/api/auth/signup
   ```
   Should return a JSON response (even an error is fine, means server is up)

**If you get:**
- ❌ "This site can't be reached" - Service is down
- ❌ "Application error" - Check logs
- ⏳ Long loading time - Service might be spinning up (free tier)

---

### Step 5: Update Frontend Environment Variable

Go to Render → Your Frontend Service → **Environment** tab

**Add/Update:**
```
VITE_API_BASE_URL=https://notes-application-backend-aj15.onrender.com
```

**Action:** Save and redeploy frontend

---

## Common Issues & Solutions

### Issue 1: "Application Error" or Service Won't Start

**Possible Causes:**
- Missing environment variables
- MongoDB connection failed
- Build command failed

**Solution:**
1. Check all environment variables are set
2. Verify MONGO_URI is correct
3. Check logs for specific error
4. Try manual redeploy: Settings → Manual Deploy → Deploy latest commit

---

### Issue 2: MongoDB Connection Error

**Error in logs:** "MongoServerError" or "MongooseServerSelectionError"

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 1-2 minutes for changes to propagate
5. Redeploy backend on Render

---

### Issue 3: Service Spins Down (Free Tier)

**Symptom:** First request takes 30-60 seconds, then works fine

**Solution:**
- This is normal for free tier
- Consider upgrading to paid plan for always-on service
- Or use a service like UptimeRobot to ping your backend every 5 minutes

---

### Issue 4: CORS Errors

**Error:** "Access to fetch blocked by CORS policy"

**Solution:**
1. Verify `FRONTEND_URL` in backend is exactly: `https://notes-application-frontend-tvp1.onrender.com`
2. No trailing slash
3. Include `https://`
4. Redeploy backend after updating

---

### Issue 5: Build Fails

**Error in logs:** Build command failed

**Solution:**
1. Check Root Directory is set to `backend`
2. Verify `package.json` exists in backend folder
3. Check Node version compatibility
4. Try clearing build cache: Settings → Clear build cache → Redeploy

---

## Quick Fix Checklist

- [ ] All 4 environment variables set in backend
- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] MongoDB Atlas allows 0.0.0.0/0
- [ ] Frontend has `VITE_API_BASE_URL` set
- [ ] Checked logs for errors
- [ ] Tried manual redeploy
- [ ] Waited 2-3 minutes after changes

---

## Still Not Working?

1. **Check Render Status:** https://status.render.com
2. **Check Service Health:** Render dashboard → Your service → Should show "Live"
3. **View Real-time Logs:** Logs tab → Watch for errors
4. **Try Manual Deploy:** Settings → Manual Deploy

---

## Test Your Backend

Once it's working, test with:

```bash
# Test signup endpoint
curl -X POST https://notes-application-backend-aj15.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

Should return a JSON response.

