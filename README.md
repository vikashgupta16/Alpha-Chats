# 🚀 Alpha-Chats

> **Elite Developer Communication Terminal** - A real-time chat application built specifically for developers

[![Built with React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)](https://vercel.com/)

Alpha-Chats is a sophisticated real-time messaging platform designed by developers, for developers. It combines the familiar terminal aesthetic with modern chat features, supporting code sharing, syntax highlighting, and seamless collaboration.

## ✨ Features

### 🔥 Core Messaging
- **Real-time messaging** with Socket.IO
- **Instant delivery** with read receipts
- **Typing indicators** and online presence
- **Unread message tracking**
- **Message persistence** with MongoDB

### 💻 Developer-Focused
- **Code syntax highlighting** for 15+ languages
- **Terminal command sharing** with proper formatting
- **File & image sharing** via Cloudinary integration
- **GitHub profile integration**
- **Terminal-inspired UI/UX**

### 🎨 User Experience
- **Dark/Light theme support**
- **Fully responsive design** (mobile-first)
- **Real-time online status**
- **Clean, modern interface**
- **Fast loading** with optimized builds

### 🔐 Security & Authentication
- **JWT-based authentication**
- **Secure cookie handling**
- **Password hashing** with bcryptjs
- **CORS protection**
- **Rate limiting ready**

## 🏗️ Architecture

```
Alpha-Chats/
├── 🎨 frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route components
│   │   ├── Hooks/              # Custom React hooks
│   │   ├── redux/              # State management
│   │   └── assets/             # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── ⚡ backend/                   # Node.js + Express API
│   ├── controllers/            # Business logic
│   ├── models/                 # Database schemas
│   ├── routes/                 # API endpoints
│   ├── middlewares/            # Custom middleware
│   ├── config/                 # Configuration files
│   └── package.json
│
├── 🧪 tests/                    # Integration tests
│   ├── test-complete-functionality.js
│   ├── test-enhanced-features.js
│   └── package.json
│
├── 📦 Deployment configs
│   ├── vercel.json            # Vercel deployment
│   ├── netlify.toml           # Netlify deployment
│   └── vite.config.js         # Build configuration
│
└── 📋 package.json            # Root dependencies
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or Atlas)
- **Git**

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/alpha-chats.git
cd alpha-chats

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `.env` file in the `backend/` directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/alpha-chats
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/alpha-chats

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=4000
NODE_ENV=development
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev    # Starts on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev    # Starts on http://localhost:5173
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Socket.IO**: Automatically connected

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI Framework |
| **Vite** | 6.3.5 | Build Tool |
| **Redux Toolkit** | 2.8.2 | State Management |
| **TailwindCSS** | 3.4.17 | Styling |
| **Socket.IO Client** | 4.8.1 | Real-time Communication |
| **React Router** | 7.6.0 | Navigation |
| **React Syntax Highlighter** | 15.6.1 | Code Highlighting |
| **Axios** | 1.9.0 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime |
| **Express** | 5.1.0 | Web Framework |
| **MongoDB** | - | Database |
| **Mongoose** | 8.15.0 | ODM |
| **Socket.IO** | 4.8.1 | Real-time Communication |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 3.0.2 | Password Hashing |
| **Cloudinary** | 2.6.1 | File Storage |
| **Multer** | 2.0.0 | File Uploads |

## 📱 API Documentation

### Authentication Endpoints
```bash
POST /api/auth/signup    # User registration
POST /api/auth/login     # User login
GET  /api/auth/logout    # User logout
```

### User Endpoints
```bash
GET  /api/user/current   # Get current user
GET  /api/user/others    # Get all other users
PUT  /api/user/profile   # Update user profile
```

### Message Endpoints
```bash
POST /api/message/send/:recipientId     # Send message
GET  /api/message/get/:recipientId      # Get conversation
POST /api/message/upload/:recipientId   # Upload files
```

### Socket.IO Events
```javascript
// Client to Server
socket.emit('join', userId)
socket.emit('sendMessage', messageData)
socket.emit('typing', { recipientId, isTyping })

// Server to Client
socket.on('newMessage', messageData)
socket.on('onlineUsers', userList)
socket.on('userTyping', typingData)
```

## 🧪 Testing

### Run All Tests
```bash
# Backend unit tests
cd backend/tests
npm test

# Integration tests
cd tests
npm install
npm run test                    # Complete functionality
npm run test:enhanced          # Enhanced features
npm run test:verification      # Fix verification
```

### Create Test Users
```bash
cd backend/tests
npm run test:users
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build frontend
cd frontend
npm run build

# Deploy dist/ folder to Netlify
```

### Manual Deployment
1. **Frontend**: Build with `npm run build` and serve `dist/` folder
2. **Backend**: Deploy to any Node.js hosting (Railway, Heroku, DigitalOcean)
3. **Database**: Use MongoDB Atlas for production

## 🎨 Screenshots

### Chat Interface  
![Chat Interface](gitHubAssests/HomeMac.png)

### Code Sharing  
![Code Sharing](gitHubAssests/Chat.png)

### Mobile Responsive  
<p>
  <img src="gitHubAssests/Mobile.png" alt="Mobile View" width="300" height="500" style="display: inline-block; margin-right: 10px;" />
  <img src="gitHubAssests/Nothing.png" alt="Nothing View" style="display: inline-block;" />
</p>




## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikash (Team Lead)**
- GitHub: [@vikashgup16](https://github.com/vikashgupta16)
- Email: vikash9c35@gmail.com

## 🙏 Acknowledgments

- **Socket.IO** team for real-time capabilities
- **React** team for the amazing framework
- **MongoDB** for robust database solutions
- **Vercel** for seamless deployment
- **TailwindCSS** for beautiful styling

## 📈 Roadmap

- [ ] **End-to-end encryption**
- [ ] **Channel/Group chats**
- [ ] **Message reactions**
- [ ] **File sharing improvements**
- [ ] **Mobile app** (React Native)
- [ ] **Desktop app** (Electron)
- [ ] **Advanced search**
- [ ] **Message threading**
- [ ] **Integration with Git**

---

<div align="center">

**Built with ❤️ for the developer community**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
