# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Whiteboard Project.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add scopes: `email` and `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Whiteboard Project`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://whiteboard-project-kush2.vercel.app` (your production frontend URL)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for local development)
     - `https://whiteboard-project-q8hp.onrender.com/api/auth/google/callback` (your production backend URL)
7. Click **Create** and copy your **Client ID** and **Client Secret**

## Step 2: Update Backend Environment Variables

Add the following to your `backend/.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://whiteboard-project-q8hp.onrender.com/api/auth/google/callback
CLIENT_URL=https://whiteboard-project-kush2.vercel.app
```

For local development:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

## Step 3: Deploy to Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add the following environment variables:
   - `GOOGLE_CLIENT_ID`: Your Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret
   - `GOOGLE_CALLBACK_URL`: `https://whiteboard-project-q8hp.onrender.com/api/auth/google/callback`
   - `CLIENT_URL`: `https://whiteboard-project-kush2.vercel.app`
5. Click **Save Changes** (this will trigger a redeploy)

## Step 4: Test the Integration

### Local Testing:
1. Start your backend: `cd backend && npm start`
2. Start your frontend: `cd frontend && npm start`
3. Navigate to `http://localhost:3000/login`
4. Click "Sign in with Google"
5. Complete the Google authentication flow
6. You should be redirected to the dashboard

### Production Testing:
1. Navigate to `https://whiteboard-project-kush2.vercel.app/login`
2. Click "Sign in with Google"
3. Complete the Google authentication flow
4. You should be redirected to the dashboard

## Features Added

### Backend:
- ✅ Passport.js integration with Google OAuth 2.0 strategy
- ✅ User model updated to support Google authentication
- ✅ New routes: `/api/auth/google` and `/api/auth/google/callback`
- ✅ Automatic user creation or linking for Google accounts
- ✅ JWT token generation after successful Google authentication

### Frontend:
- ✅ Google Sign In button on Login page
- ✅ Google Sign Up button on Register page
- ✅ Google OAuth callback handler page
- ✅ Automatic token storage and user authentication
- ✅ Seamless redirect to dashboard after authentication

## How It Works

1. User clicks "Sign in with Google" button
2. User is redirected to Google's OAuth consent screen
3. User grants permissions
4. Google redirects back to backend callback URL with authorization code
5. Backend exchanges code for user profile information
6. Backend creates or updates user in database
7. Backend generates JWT token
8. Backend redirects to frontend with token
9. Frontend stores token and fetches user data
10. User is redirected to dashboard

## Security Notes

- Never commit your `.env` file with real credentials
- Use different OAuth credentials for development and production
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Regularly rotate your secrets
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

### "Redirect URI mismatch" error:
- Ensure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes
- Verify HTTP vs HTTPS

### "Access blocked" error:
- Add your email to test users in OAuth consent screen
- Verify your app is not in production mode if using external user type

### Token not being stored:
- Check browser console for errors
- Verify `CLIENT_URL` environment variable is correct
- Ensure CORS is properly configured

## Support

For issues or questions, contact:
- Developer: Kushagra Saxena
- Email: kushagrasaxena0913@gmail.com
- LinkedIn: https://www.linkedin.com/in/kushagra1309/
