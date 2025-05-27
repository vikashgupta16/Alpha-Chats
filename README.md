# 🚀 Alpha-Chats

> A modern, real-time chat application built for Alpha Coders

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8+-purple.svg)](https://socket.io/)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [🚀 Running the Application](#-running-the-application)
- [🌐 API Endpoints](#-api-endpoints)
- [🔒 Environment Variables](#-environment-variables)
- [🎨 UI Preview](#-ui-preview)
- [📱 Features Walkthrough](#-features-walkthrough)
- [🔧 Development](#-development)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔥 Core Features
- **Real-time Messaging** - Instant message delivery with Socket.io
- **User Authentication** - Secure JWT-based login/signup system
- **User Profiles** - Customizable user profiles with image support
- **Message History** - Persistent message storage and retrieval
- **User Search** - Find and connect with other users
- **File Uploads** - Share images in conversations via Cloudinary
- **Responsive Design** - Mobile-first design with Tailwind CSS

### 🎯 Advanced Features  
- **Error Boundaries** - Graceful error handling throughout the app
- **Loading States** - Smooth user experience with loading indicators
- **Form Validation** - Client-side validation for all forms
- **Protected Routes** - Secure navigation with route guards
- **Real-time Status** - Live connection status and message delivery
- **Search Functionality** - Search users in real-time
- **404 Handling** - Custom 404 page with navigation options

### 🔧 Technical Features
- **Redux State Management** - Centralized application state
- **Custom Hooks** - Reusable React hooks for common operations  
- **Socket.io Integration** - Real-time bidirectional communication
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **Cloudinary Integration** - Cloud-based image storage and optimization

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1+
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.io 4.8+
- **File Upload:** Multer + Cloudinary
- **Security:** bcryptjs, CORS, cookie-parser

### Frontend  
- **Framework:** React 19+ with Vite 6+
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM 7+
- **Styling:** Tailwind CSS 3.4+
- **Icons:** React Icons 5.5+
- **HTTP Client:** Axios 1.9+
- **Real-time:** Socket.io-client 4.8+

### Development Tools
- **Linting:** ESLint with React plugins
- **Build Tool:** Vite (Frontend) / Nodemon (Backend)
- **Version Control:** Git with proper .gitignore
- **Package Manager:** npm

## 🏗️ Project Structure

```
Alpha-Chats/
├── 📁 backend/                 # Backend application
│   ├── 📁 config/             # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   ├── db.js              # MongoDB connection
│   │   └── token.js           # JWT token utilities
│   ├── 📁 controllers/        # Business logic
│   │   ├── auth.controllers.js # Authentication logic
│   │   ├── message.controller.js # Message operations
│   │   └── user.controller.js  # User operations
│   ├── 📁 middlewares/        # Express middlewares
│   │   ├── isAuth.js          # Authentication middleware
│   │   └── multer.js          # File upload middleware
│   ├── 📁 models/             # Database schemas
│   │   ├── conversation.model.js # Conversation schema
│   │   ├── message.model.js   # Message schema
│   │   └── user.model.js      # User schema
│   ├── 📁 routes/             # API routes
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── message.routes.js  # Message routes
│   │   └── user.routes.js     # User routes
│   ├── 📁 public/             # Static file uploads
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   └── .gitignore             # Git ignore rules
│
├── 📁 frontend/               # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   │   ├── ErrorBoundary.jsx   # Error handling component
│   │   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   │   ├── MessageArea.jsx     # Chat message display
│   │   │   └── SideBar.jsx         # User list sidebar
│   │   ├── 📁 pages/          # Page components
│   │   │   ├── Home.jsx       # Main chat interface
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── SignUp.jsx     # Registration page  
│   │   │   ├── Profile.jsx    # User profile page
│   │   │   └── NotFound.jsx   # 404 error page
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   │   ├── getCurrentUser.js   # User authentication hook
│   │   │   ├── getOtherUsers.js    # Users fetching hook
│   │   │   └── useSocket.js        # Socket.io integration hook
│   │   ├── 📁 redux/          # State management
│   │   │   ├── store.js       # Redux store configuration
│   │   │   └── userSlice.js   # User state slice
│   │   ├── 📁 assets/         # Static assets
│   │   │   ├── logo.png       # App logo
│   │   │   └── pp.webp        # Default profile picture
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── eslint.config.js       # ESLint configuration
│
└── README.md                  # Project documentation
```

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Alpha-Chats
   ```

2. **Set up environment variables**
   ```bash
   # Backend environment (.env in backend/ directory)
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Install and run**
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies  
   cd ../frontend && npm install
   
   # Start both servers (run in separate terminals)
   cd ../backend && npm run dev     # Backend on http://localhost:4000
   cd ../frontend && npm run dev    # Frontend on http://localhost:5173
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create an account and start chatting! 🎉

## 🔧 Installation

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://mongodb.com/try/download/community) or [Atlas](https://mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Development Mode

**Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
# Socket.io server ready for real-time features
```

**Frontend Development Server:**
```bash
cd frontend  
npm run dev
# App runs on http://localhost:5173
# Hot reload enabled for development
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/logout` | User logout | ✅ |

### User Routes (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/current` | Get current user info | ✅ |
| GET | `/others` | Get all other users | ✅ |
| PUT | `/update` | Update user profile | ✅ |

### Message Routes (`/api/message`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/send/:receiverId` | Send message | ✅ |
| GET | `/get/:receiverId` | Get conversation messages | ✅ |

### Socket.io Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `user-login` | Client → Server | User joins their room |
| `send-message` | Client → Server | Send real-time message |
| `receive-message` | Server → Client | Receive real-time message |
| `new-message` | Server → Client | Broadcast new messages |

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/alpha-chats
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/alpha-chats

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration  
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Security Notes 🔐
- **Never commit `.env` files** to version control
- **Use strong, unique JWT secrets** in production
- **Rotate secrets regularly** in production environments
- **Use environment-specific configurations** for different deployments

## 🎨 UI Preview

### 🔐 Authentication Pages
- **Login Page**: Clean, professional login interface with validation
- **Signup Page**: User registration with real-time form validation
- **Error Handling**: Comprehensive error messages and states

### 💬 Chat Interface  
- **Sidebar**: User list with search functionality and online status
- **Message Area**: Real-time chat with message history and timestamps
- **Message Input**: Rich message composition with file upload support
- **Responsive Design**: Seamless experience on desktop and mobile

### 👤 User Experience
- **Loading States**: Smooth loading indicators throughout the app
- **Error Boundaries**: Graceful error handling with recovery options
- **404 Page**: Custom not-found page with navigation assistance

## 📱 Features Walkthrough

### 🚀 Getting Started
1. **Create Account**: Register with email/username and password
2. **Login**: Secure authentication with JWT tokens
3. **Profile Setup**: Add profile picture and personal information

### 💬 Messaging
1. **User Discovery**: Search and find other users in the sidebar
2. **Start Conversation**: Click on any user to begin chatting
3. **Real-time Chat**: Send and receive messages instantly
4. **Media Sharing**: Upload and share images in conversations
5. **Message History**: Scroll through previous conversations

### 🔧 Advanced Features
1. **Search Users**: Real-time user search with filtering
2. **Profile Management**: Update your profile and settings
3. **Responsive Design**: Use on any device - desktop, tablet, or mobile
4. **Error Recovery**: Automatic error handling and recovery mechanisms

## 🔧 Development

### Code Style & Standards
- **ESLint**: Configured with React and modern JavaScript rules
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Component Structure**: Modular, reusable React components
- **Hook Patterns**: Custom hooks for business logic separation

### Development Workflow
1. **Install dependencies**: `npm install` in both directories
2. **Start development servers**: Run backend and frontend in separate terminals
3. **Hot reload**: Both frontend (Vite) and backend (Nodemon) support hot reload
4. **Linting**: Run `npm run lint` in frontend for code quality checks

### Testing the Application
1. **Create multiple user accounts** to test real-time messaging
2. **Test file uploads** with image attachments
3. **Verify responsive design** on different screen sizes
4. **Test error scenarios** like network disconnections

## 🚀 Deployment

### Backend Deployment Options

**1. Heroku**
```bash
# Install Heroku CLI and login
heroku create alpha-chats-backend
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
# ... set other environment variables
git push heroku main
```

**2. Railway/Render/DigitalOcean**
- Set environment variables in platform dashboard
- Deploy from GitHub repository
- Ensure MongoDB Atlas connection for database

### Frontend Deployment Options

**1. Vercel**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**2. Netlify**
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify or connect GitHub repo
```

**3. Build for static hosting**
```bash
cd frontend
npm run build
# Deploy the dist/ folder to any static hosting service
```

### Production Checklist ✅
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB database (MongoDB Atlas)
- [ ] Configure CORS for production domain
- [ ] Set strong JWT secret
- [ ] Configure Cloudinary for production
- [ ] Set up domain and SSL certificate
- [ ] Configure CDN for static assets (optional)
- [ ] Set up monitoring and logging

## 🤝 Contributing

We welcome contributions to Alpha-Chats! Here's how you can help:

### Getting Started
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper commit messages
4. **Test thoroughly** on both backend and frontend
5. **Submit a pull request** with a clear description

### Contribution Guidelines
- **Follow existing code style** and ESLint rules
- **Write clear commit messages** describing your changes
- **Test your changes** thoroughly before submitting
- **Update documentation** if you add new features
- **Be respectful** in discussions and code reviews

### Areas for Contribution
- 🐛 **Bug fixes** - Help identify and fix issues
- ✨ **New features** - Add exciting new capabilities
- 📚 **Documentation** - Improve guides and documentation
- 🎨 **UI/UX improvements** - Enhance the user experience
- ⚡ **Performance optimizations** - Make the app faster
- 🧪 **Testing** - Add unit and integration tests

## 📄 License

This project is licensed under the **ISC License**.

```
Copyright (c) 2025 Vikash (Team Lead) - Alpha Coders

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Team Lead**: Vikash - For project leadership and architecture
- **Alpha Coders Community** - For inspiration and feedback
- **Open Source Community** - For the amazing tools and libraries used

## 📞 Support

Having issues? Here's how to get help:

1. **Check the documentation** above for common setup issues
2. **Search existing issues** in the GitHub repository
3. **Create a new issue** with detailed information about your problem
4. **Join our community** for discussions and support

---

<div align="center">

**Built with ❤️ by Alpha Coders**

[⭐ Star this repository](https://github.com/your-username/alpha-chats) if you found it helpful!

</div>
