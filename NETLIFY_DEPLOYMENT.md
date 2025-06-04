# 🌐 Alpha-Chat Netlify Deployment Guide

## 🎯 Deployment Strategy

**Frontend**: Netlify (React/Vite app)
**Backend**: Railway/Render/Heroku (Node.js/Express)

This approach is recommended because:
- ✅ Better performance for real-time features (Socket.IO)
- ✅ Easier to manage and debug
- ✅ More reliable for database connections
- ✅ Simpler environment variable management

## 🚀 Step 1: Deploy Backend to Railway (Free & Easy)

### 1.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### 1.2 Deploy Backend
1. Connect your GitHub repository
2. Select the `backend` folder as root
3. Railway will auto-detect Node.js and deploy

### 1.3 Add Environment Variables to Railway
```bash
NODE_ENV=production
PORT=4000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 1.4 Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://your-app-name.up.railway.app`

## 🎨 Step 2: Configure Frontend for Netlify

### 2.1 Update Frontend Environment Variables
Create `frontend/.env.production`:
```bash
VITE_API_URL=https://your-railway-backend-url.up.railway.app
VITE_SOCKET_URL=https://your-railway-backend-url.up.railway.app
```

### 2.2 Create Netlify Configuration
Create `netlify.toml` in project root (already created above).

### 2.3 Update CORS in Backend
Update your backend to allow Netlify domain:

## 🚀 Step 3: Deploy to Netlify

### 3.1 Via Netlify Dashboard (Recommended)
1. Go to [Netlify.com](https://netlify.com)
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Choose your Alpha-Chat repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 3.2 Add Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables:
```bash
VITE_API_URL=https://your-railway-backend-url.up.railway.app
VITE_SOCKET_URL=https://your-railway-backend-url.up.railway.app
VITE_NODE_ENV=production
```

### 3.3 Deploy
Click "Deploy site" and wait for build to complete.

## 🔧 Step 4: Update Backend CORS

### 4.1 Add Netlify Domain to CORS
In your `backend/index.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        "https://your-netlify-app.netlify.app",
        "https://your-custom-domain.com", // if you have one
        process.env.FRONTEND_URL
      ] 
    : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))
```

### 4.2 Update Socket.IO CORS
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          "https://your-netlify-app.netlify.app",
          "https://your-custom-domain.com",
          process.env.FRONTEND_URL
        ]
      : ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
})
```

## 🎯 Alternative: Railway for Both Frontend & Backend

If you prefer to keep everything in one place:

### Railway Full-Stack Deployment
1. Deploy backend to Railway (as above)
2. Create second Railway service for frontend
3. Connect same GitHub repo
4. Set build command: `cd frontend && npm run build`
5. Set start command: `cd frontend && npm run preview`

## ✅ Testing Your Deployment

### Frontend (Netlify)
- [ ] Site loads at your Netlify URL
- [ ] All pages render correctly
- [ ] Theme switching works
- [ ] No console errors

### Backend (Railway)
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] File uploads function
- [ ] Socket.IO connects

### Integration
- [ ] Login/signup works
- [ ] Real-time messaging functions
- [ ] File uploads complete
- [ ] All message types work

## 🔄 Continuous Deployment

Both Netlify and Railway will auto-deploy when you push to GitHub:

```powershell
git add .
git commit -m "🚀 Deploy to Netlify + Railway"
git push origin main
```

## 💰 Cost Comparison

### Netlify (Frontend)
- ✅ Free tier: 100GB bandwidth, 300 build minutes
- ✅ Custom domains included
- ✅ Global CDN

### Railway (Backend)
- ✅ Free tier: 512MB RAM, $5 credit/month
- ✅ Auto-scaling
- ✅ Built-in metrics

### Total Cost: **FREE** for small to medium apps!

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails on Netlify**
   - Check Node.js version in `netlify.toml`
   - Verify build command and directory

2. **CORS Errors**
   - Ensure Netlify URL is in backend CORS config
   - Check environment variables

3. **Socket.IO Connection Issues**
   - Verify backend URL in frontend env vars
   - Check Railway backend logs

## 🎉 Success!

Your Alpha-Chat will be live on:
- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-app.up.railway.app`

This setup provides:
- 🚀 Fast global CDN (Netlify)
- 🔄 Real-time features (Railway)
- 💰 Free hosting for both services
- 🔧 Easy continuous deployment
