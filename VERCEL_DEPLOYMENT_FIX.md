# Fix Vercel Deployment - Registration Failed

## Problem
Your Vercel frontend is trying to connect to `http://localhost:5000` instead of your Render backend URL.

## Solution

### Option 1: Set Environment Variable in Vercel Dashboard (RECOMMENDED)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `whiteboard-project`
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `REACT_APP_SERVER_URL`
   - **Value**: `https://your-backend-url.onrender.com` (replace with your actual Render URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots (...) on the latest deployment
8. Click **Redeploy**
9. Wait for deployment to complete

### Option 2: Update .env.production File

1. Update `frontend/.env.production` with your Render backend URL:
```env
REACT_APP_SERVER_URL=https://your-backend-url.onrender.com
```

2. Commit and push:
```bash
git add frontend/.env.production
git commit -m "Update production backend URL"
git push origin main
```

3. Vercel will automatically redeploy

---

## How to Find Your Render Backend URL

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your backend service
3. Copy the URL at the top (looks like: `https://whiteboard-backend-xxxx.onrender.com`)
4. Use this URL in `REACT_APP_SERVER_URL` (without `/api` at the end)

---

## Verify Backend is Running

Test your backend by visiting:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{"message":"Server is running","status":"OK"}
```

---

## Complete Checklist

### Backend (Render)
- [ ] Backend is deployed and running
- [ ] Environment variables are set:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI=your_mongodb_connection_string`
  - `JWT_SECRET=your_secret`
  - `CORS_ORIGIN=https://whiteboard-project-olive.vercel.app`
- [ ] Health check endpoint works: `/api/health`

### Frontend (Vercel)
- [ ] Environment variable is set:
  - `REACT_APP_SERVER_URL=https://your-backend-url.onrender.com`
- [ ] Redeployed after setting environment variable
- [ ] No trailing slashes in URLs
- [ ] Using HTTPS (not HTTP) for backend URL

---

## Test Registration

After fixing:

1. Go to your Vercel URL: `https://whiteboard-project-olive.vercel.app`
2. Click "Create Account" or go to `/register`
3. Fill in the form:
   - Username: test123
   - Email: test@example.com
   - Password: test123456
   - Confirm Password: test123456
4. Click "Create Account"
5. Should redirect to Dashboard

---

## Common Errors and Solutions

### Error: "Registration failed"
**Cause**: Frontend can't reach backend
**Solution**: 
- Check `REACT_APP_SERVER_URL` is set correctly in Vercel
- Verify backend is running on Render
- Check browser console for network errors

### Error: "CORS policy"
**Cause**: Backend not allowing requests from Vercel
**Solution**:
- Update `CORS_ORIGIN` in Render to match your Vercel URL exactly
- No trailing slashes
- Redeploy backend after changing

### Error: "Network Error"
**Cause**: Backend URL is wrong or backend is down
**Solution**:
- Verify backend URL is correct
- Check Render dashboard - backend should be "Running"
- Test health endpoint: `https://your-backend-url.onrender.com/api/health`

### Error: "Failed to fetch"
**Cause**: Using HTTP instead of HTTPS
**Solution**:
- Make sure `REACT_APP_SERVER_URL` uses `https://` not `http://`

---

## Quick Test Commands

### Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Test Registration Endpoint
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

---

## Still Not Working?

1. **Check Browser Console**:
   - Press F12
   - Go to Console tab
   - Look for red errors
   - Share the error message

2. **Check Network Tab**:
   - Press F12
   - Go to Network tab
   - Try to register
   - Look for failed requests (red)
   - Click on the failed request
   - Check the URL it's trying to reach

3. **Check Render Logs**:
   - Go to Render Dashboard
   - Click on your service
   - Go to "Logs" tab
   - Look for errors when you try to register

---

**Need Help?**
- Email: kushagrasaxena0913@gmail.com
- LinkedIn: https://www.linkedin.com/in/kushagra1309/
