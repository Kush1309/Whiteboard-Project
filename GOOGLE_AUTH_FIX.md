# Google OAuth Callback URL Fix

## Problem
Getting "Cannot GET /auth/google/callback" error when trying to sign in with Google.

## Root Cause
The callback URL was missing `/api` prefix. The correct callback URL should be `/api/auth/google/callback` not `/auth/google/callback`.

## Solution

### 1. Update Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Select your project
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, make sure you have:

**For Local Development:**
```
http://localhost:5000/api/auth/google/callback
```

**For Production (Render):**
```
https://whiteboard-project-q8hp.onrender.com/api/auth/google/callback
```

5. Click **Save**

### 2. Update Backend Environment Variables

**Local Development (.env file):**
```env
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

**Production (Render Environment Variables):**
```env
GOOGLE_CALLBACK_URL=https://whiteboard-project-q8hp.onrender.com/api/auth/google/callback
CLIENT_URL=https://whiteboard-project-kush2.vercel.app
```

### 3. Restart Your Services

**Local:**
- Stop your backend server (Ctrl+C)
- Restart: `cd backend && npm start`

**Production:**
- After updating environment variables in Render, it will automatically redeploy
- Or manually trigger a redeploy

### 4. Test the Flow

1. Go to your login page
2. Click "Sign in with Google"
3. You should be redirected to Google's consent screen
4. After granting permissions, you should be redirected back to your app
5. You should land on the dashboard, logged in

## Complete OAuth Flow

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: http://localhost:5000/api/auth/google
    ↓
Backend redirects to: Google OAuth consent screen
    ↓
User grants permissions
    ↓
Google redirects to: http://localhost:5000/api/auth/google/callback
    ↓
Backend processes authentication, generates JWT token
    ↓
Backend redirects to: http://localhost:3000/auth/google/callback?token=xxx
    ↓
Frontend stores token and fetches user data
    ↓
Frontend redirects to: http://localhost:3000/dashboard
```

## Troubleshooting

### Still getting "Cannot GET" error?
- Double-check the callback URL in Google Console matches exactly
- Make sure there are no trailing slashes
- Verify your backend is running on the correct port
- Check backend logs for any errors

### "Redirect URI mismatch" error?
- The callback URL in Google Console must EXACTLY match the one in your .env
- Check for http vs https
- Check for trailing slashes
- Verify the port number

### Token not being stored?
- Check browser console for errors
- Verify CLIENT_URL is set correctly in backend .env
- Make sure CORS is configured to allow your frontend URL

## Current Configuration

**Backend Routes:**
- Initiate OAuth: `GET /api/auth/google`
- Callback: `GET /api/auth/google/callback`

**Frontend Routes:**
- Callback handler: `/auth/google/callback` (receives token from backend)

**Environment Variables Required:**
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL`: Backend callback URL (with /api prefix)
- `CLIENT_URL`: Frontend URL for redirects
