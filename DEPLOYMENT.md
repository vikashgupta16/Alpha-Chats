# 🚀 Alpha-Chat Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a MongoDB database
4. **Cloudinary Account**: For file uploads

## 🔧 Environment Variables Setup

### 📊 For Vercel Dashboard:
Add these environment variables in your Vercel project settings:

```bash
# Backend Environment Variables
NODE_ENV=production
PORT=4000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/alphaChat?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend Environment Variables  
VITE_API_URL=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
```

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```powershell
npm install -g vercel
```

### 2. Login to Vercel
```powershell
vercel login
```

### 3. Deploy from Project Root
```powershell
Set-Location "d:\Alpha-Chat"
vercel
```

### 4. Follow the Prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Found project "Alpha-Chat". Link to it?** → `Y` (or `N` for new project)
- **In which directory is your code located?** → `./`

### 5. Configure Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all environment variables listed above
5. Make sure to select **Production**, **Preview**, and **Development** for each variable

### 6. Redeploy with Environment Variables
```powershell
vercel --prod
```

## 🔐 Security Configuration

### MongoDB Atlas Setup:
1. **Whitelist IPs**: In MongoDB Atlas, go to **Network Access**
2. **Add IP**: `0.0.0.0/0` (Allow access from anywhere for Vercel)
3. **Database User**: Ensure you have a database user with read/write permissions

### JWT Secret:
Generate a secure JWT secret:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🌐 Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `VITE_API_URL` and `FRONTEND_URL` to use your custom domain

## ✅ Testing Your Deployment

### 1. Basic Functionality Test
- [ ] Visit your deployed URL
- [ ] User registration works
- [ ] User login works
- [ ] Real-time messaging functions
- [ ] File uploads work (profile pictures)
- [ ] Theme switching works
- [ ] All message types work (text/code/terminal)

### 2. Performance Test
- [ ] Page loads within 3 seconds
- [ ] Images load properly
- [ ] Socket.IO connection establishes
- [ ] No console errors

## 🐛 Troubleshooting

### Common Issues:

#### 1. **500 Internal Server Error**
- Check Vercel function logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

#### 2. **CORS Errors**
- Verify `FRONTEND_URL` environment variable
- Check that your domain is properly configured

#### 3. **Socket.IO Not Connecting**
- Ensure WebSocket support is enabled
- Check browser network tab for connection errors
- Verify server-side Socket.IO configuration

#### 4. **File Uploads Failing**
- Check Cloudinary credentials
- Verify API key permissions
- Ensure file size limits are appropriate

### 📝 Debug Commands:
```powershell
# Check Vercel function logs
vercel logs [deployment-url]

# Local development with production config
npm run build
npm run preview
```

## 📊 Production Optimizations

### Already Implemented:
- ✅ Code splitting (vendor, router, icons, syntax chunks)
- ✅ Production CORS configuration
- ✅ Environment-based API URLs
- ✅ Optimized build settings
- ✅ Static asset optimization

### Recommended Next Steps:
1. **CDN**: Use Vercel's global CDN (automatic)
2. **Analytics**: Add Vercel Analytics
3. **Monitoring**: Implement error tracking (Sentry)
4. **Database**: Consider MongoDB Atlas clusters for better performance

## 🔄 Continuous Deployment

Your app will automatically deploy when you push to your connected GitHub branch:

```powershell
git add .
git commit -m "Update Alpha-Chat"
git push origin main
```

## 📞 Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Socket.IO Vercel Guide](https://socket.io/docs/v4/deployment/vercel/)
3. Check your environment variables in Vercel Dashboard

---

## 🎉 Success! 

Your Alpha-Chat application is now live on Vercel with:
- 🔥 Cyber-themed modern design
- 💬 Real-time messaging with Socket.IO
- 🛡️ Secure authentication
- 📱 Mobile-responsive interface
- ☁️ Cloud file storage
- 🌓 Dark/light theme switching
- 💻 Code syntax highlighting

**Live URL**: `https://your-app-name.vercel.app`
