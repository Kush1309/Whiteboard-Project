# Deployment Guide

## Backend Deployment (Render)

### Step 1: Push to GitHub
Your code is already on GitHub at: `https://github.com/Kush1309/Whiteboard-Project`

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `whiteboard-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Set Environment Variables in Render

Go to "Environment" tab and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://Kush:GEJVSmZhPl5M6NbU@cluster0.ldbfrk6.mongodb.net/WhiteBoard?appName=Cluster0
JWT_SECRET=Harshit@143
CORS_ORIGIN=https://whiteboard-project-olive.vercel.app
```

**Important:** Replace `CORS_ORIGIN` with your actual Vercel frontend URL (without trailing slash)

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

Your backend URL will be something like: `https://whiteboard-backend-xxxx.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel

Go to "Settings" → "Environment Variables" and add:

```
REACT_APP_SERVER_URL=https://your-backend-url.onrender.com
```

**Important:** Replace with your actual Render backend URL (no trailing slash, no /api)

Example:
```
REACT_APP_SERVER_URL=https://whiteboard-backend-xxxx.onrender.com
```

### Step 3: Deploy
Click "Deploy" and wait for deployment to complete.

---

## Post-Deployment Steps

### 1. Update Backend CORS_ORIGIN

After getting your Vercel URL, update the `CORS_ORIGIN` environment variable in Render:

1. Go to Render Dashboard → Your Service → Environment
2. Update `CORS_ORIGIN` to your Vercel URL (e.g., `https://whiteboard-project-olive.vercel.app`)
3. Save changes (this will trigger a redeploy)

### 2. Test the Application

1. Visit your Vercel URL
2. Try to register a new account
3. Try to login
4. Create a room and test drawing
5. Test chat and video features

---

## Troubleshooting

### Registration Failed Error

**Cause**: CORS misconfiguration or backend not accessible

**Solutions**:
1. Check backend logs in Render dashboard
2. Verify `CORS_ORIGIN` in Render matches your Vercel URL exactly (no trailing slash)
3. Verify `REACT_APP_SERVER_URL` in Vercel points to your Render backend URL
4. Check MongoDB connection string is correct
5. Ensure backend is running (check Render dashboard)

### Backend Not Responding

**Solutions**:
1. Check Render logs for errors
2. Verify MongoDB connection string
3. Check if Render service is running
4. Verify environment variables are set correctly

### Socket Connection Failed

**Solutions**:
1. Verify `REACT_APP_SERVER_URL` is set correctly in Vercel
2. Check browser console for WebSocket errors
3. Ensure backend allows WebSocket connections (already configured)

### CORS Errors

**Solutions**:
1. Verify `CORS_ORIGIN` in Render backend matches your Vercel frontend URL
2. No trailing slashes in URLs
3. Use HTTPS for production URLs
4. Check browser console for specific CORS error messages

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://Kush:GEJVSmZhPl5M6NbU@cluster0.ldbfrk6.mongodb.net/WhiteBoard?appName=Cluster0
JWT_SECRET=Harshit@143
CORS_ORIGIN=https://whiteboard-project-olive.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_SERVER_URL=https://whiteboard-backend-xxxx.onrender.com
```

---

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **MongoDB Atlas**:
   - Ensure your IP whitelist includes `0.0.0.0/0` for Render to connect
   - Or add Render's IP addresses to whitelist

3. **Security**:
   - Change `JWT_SECRET` to a strong random string for production
   - Never commit `.env` files to GitHub
   - Use environment variables for all sensitive data

4. **Updates**:
   - Push to GitHub to trigger automatic redeployment on both platforms
   - Vercel redeploys automatically on push
   - Render redeploys automatically on push (if auto-deploy is enabled)

---

## Testing Locally with Production URLs

To test with production backend locally:

1. Update `frontend/.env`:
```env
REACT_APP_SERVER_URL=https://your-backend-url.onrender.com
```

2. Restart frontend:
```bash
cd frontend
npm start
```

---

**Developer:** Kushagra Saxena  
**Email:** kushagrasaxena0913@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/kushagra1309/
