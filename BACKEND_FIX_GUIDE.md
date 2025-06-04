# Backend Deployment Fix Guide

## Current Issue
Your backend at `https://alpha-chats-backend.vercel.app/api/user/current` is returning a 404 because:

1. ❌ The backend is showing source code instead of running as a serverless function
2. ❌ Missing proper `vercel.json` configuration for the backend
3. ❌ Routes are not properly configured for Vercel's serverless environment

## ✅ Solution Applied

### 1. Created Backend-Specific `vercel.json`
I've added `backend/vercel.json` with proper configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/socket.io/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "index.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 Deployment Steps

### Option 1: Redeploy Backend (Recommended)
1. Go to your Vercel dashboard
2. Find the `alpha-chats-backend` project
3. Go to Settings → Domains
4. Trigger a new deployment with the latest commit
5. Or delete and reimport the backend folder

### Option 2: Deploy Backend Separately
```bash
# In your backend folder
cd backend
vercel --prod
# Follow prompts to deploy
```

### Option 3: Use Vercel CLI from Backend Directory
```bash
cd d:\Alpha-Chats\backend
npx vercel --prod
```

## 🔧 Environment Variables Check

Make sure your backend has these environment variables set in Vercel:

```
MONGO_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

## 🧪 Testing After Deployment

Once redeployed, test these endpoints:

1. **Health Check**: `https://alpha-chats-backend.vercel.app/`
   - Should return: Server response, not source code

2. **User Current**: `https://alpha-chats-backend.vercel.app/api/user/current`
   - Should return: `{"message": "Authentication required"}` or user data if authenticated

3. **Auth Test**: `https://alpha-chats-backend.vercel.app/api/auth/`
   - Should return: Auth routes response

## 🔍 Expected Behavior After Fix

✅ **Before Fix:**
```
GET /api/user/current → 404: NOT_FOUND
```

✅ **After Fix:**
```
GET /api/user/current → 401: Unauthorized (if no auth) OR 200: User data (if authenticated)
```

## 🚨 Important Notes

1. **Socket.io on Vercel**: Socket.io has limitations on Vercel serverless functions. Consider using:
   - Railway.app
   - Render.com
   - DigitalOcean App Platform
   For better WebSocket support

2. **Function Timeout**: Vercel free plan has 10s timeout, Pro has 30s

3. **Cold Starts**: First request might be slow due to serverless cold starts

---

**Next Steps:**
1. Redeploy the backend with the new `vercel.json`
2. Test the API endpoints
3. Update frontend API URLs if needed
4. Consider migrating to a platform with better WebSocket support for production

**Status**: 🔧 Configuration Added - Needs Redeployment
