# Backend Environment Variables for Render

## Required Environment Variables

You need to set these **3 required** environment variables in Render for your backend:

### 1. MONGO_URI (Required)
**Description:** MongoDB connection string  
**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**How to get it:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your actual database password
- Replace `<dbname>` with your database name (optional, can leave as is)

---

### 2. JWT_SECRET (Required)
**Description:** Secret key for signing and verifying JWT tokens  
**Example:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**How to generate:**
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
- Copy the output
- Use it as your `JWT_SECRET`
- Make it at least 32 characters long
- Keep it secret and never commit to Git

---

### 3. FRONTEND_URL (Required)
**Description:** Your frontend deployment URL for CORS configuration  
**Example:**
```
https://your-frontend-name.onrender.com
```

**How to get it:**
- Deploy your frontend first on Render
- Copy the URL Render gives you (e.g., `https://notes-frontend.onrender.com`)
- Use the exact URL including `https://`
- No trailing slash

**Note:** You can set this to `http://localhost:5173` initially, then update it after deploying frontend.

---

## Optional Environment Variables

### 4. NODE_ENV (Optional but Recommended)
**Description:** Environment mode  
**Value:**
```
production
```

**Note:** Render may set this automatically, but you can set it explicitly.

---

### 5. PORT (Not Needed - Auto-provided)
**Description:** Server port  
**Note:** Render automatically provides the `PORT` environment variable. Your code already handles this with `process.env.PORT || 3000`, so you don't need to set it manually.

---

## Quick Setup Checklist

When deploying backend on Render, add these environment variables:

- [ ] **MONGO_URI** - Your MongoDB connection string
- [ ] **JWT_SECRET** - Generated secret key (at least 32 characters)
- [ ] **FRONTEND_URL** - Your frontend URL (can update after frontend deployment)
- [ ] **NODE_ENV** - Set to `production` (optional)

---

## How to Add in Render

1. Go to your backend service in Render dashboard
2. Click on **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter the **Key** and **Value**
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Example Values (Don't use these in production!)

```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/notesapp?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6
FRONTEND_URL=https://notes-frontend.onrender.com
NODE_ENV=production
```

---

## Security Tips

1. **Never commit environment variables to Git**
   - They should only be in Render dashboard
   - Your `.env` file should be in `.gitignore`

2. **Use strong JWT_SECRET**
   - Use random, long strings
   - At least 32-64 characters
   - Generate using crypto.randomBytes

3. **Protect your MongoDB connection string**
   - Use strong passwords
   - Limit network access in MongoDB Atlas
   - Use IP whitelist if possible

4. **Update FRONTEND_URL after frontend deployment**
   - Set it initially to localhost for testing
   - Update to production URL after frontend is deployed

---

## Troubleshooting

### "MongoServerError: Authentication failed"
- Check your MongoDB username and password
- Verify the connection string format
- Make sure your MongoDB user has proper permissions

### "JWT verification failed"
- Ensure JWT_SECRET is set correctly
- Check for typos in the variable name
- Redeploy after setting the variable

### CORS errors
- Verify FRONTEND_URL matches your frontend URL exactly
- Include `https://` in the URL
- Check for trailing slashes
- Make sure frontend is deployed first

### "Cannot connect to MongoDB"
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify the connection string format
- Check if your MongoDB cluster is running

