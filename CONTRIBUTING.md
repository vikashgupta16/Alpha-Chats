# Contributing to Alpha-Chats

Thank you for considering contributing to Alpha-Chats! This document provides guidelines and instructions for contributing to the project.

## 🚀 Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/alpha-chats.git
   cd alpha-chats
   ```
3. **Set up the development environment** (see main README.md)
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Setup Steps
1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

## 📝 Code Style Guidelines

### General Rules
- Use **ES6+ JavaScript** features
- Write **clear, descriptive variable names**
- Add **comments for complex logic**
- Follow **existing code patterns**

### Backend (Node.js/Express)
- Use **ES6 modules** (import/export)
- Follow **RESTful API conventions**
- Use **async/await** for asynchronous operations
- Add **proper error handling**
- Use **meaningful HTTP status codes**

### Frontend (React)
- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Keep **components small and focused**
- Use **custom hooks** for reusable logic

### Database (MongoDB)
- Use **Mongoose schemas** for validation
- Follow **MongoDB naming conventions**
- Add **proper indexes** for performance
- Use **population** for references

## 🔧 Coding Standards

### File Naming
- Use **kebab-case** for file names: `user-controller.js`
- Use **PascalCase** for React components: `MessageArea.jsx`
- Use **camelCase** for regular JavaScript files: `authService.js`

### Variable Naming
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **UPPER_SNAKE_CASE** for constants

### Function Guidelines
- Keep functions **small and focused**
- Use **descriptive function names**
- Add **JSDoc comments** for complex functions
- Return **early** to reduce nesting

## 🧪 Testing Guidelines

### Testing Requirements
- **Test your changes** thoroughly before submitting
- **Test both frontend and backend** functionality
- **Test on different screen sizes** (responsive design)
- **Test error scenarios** and edge cases

### Manual Testing Checklist
- [ ] User registration and login work
- [ ] Real-time messaging functions properly
- [ ] File uploads work correctly
- [ ] User search functions
- [ ] Responsive design works on mobile
- [ ] Error handling displays appropriate messages

## 📋 Pull Request Process

### Before Submitting
1. **Test your changes** thoroughly
2. **Run linting** in frontend: `npm run lint`
3. **Update documentation** if needed
4. **Write clear commit messages**

### Commit Message Format
```
type(scope): brief description

Longer description if needed

Fixes #issue-number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality
fix(chat): resolve message ordering issue
docs(readme): update installation instructions
```

### Pull Request Guidelines
1. **Create descriptive PR title**
2. **Fill out PR template** (if available)
3. **Link related issues**
4. **Add screenshots** for UI changes
5. **Request review** from maintainers

## 🐛 Bug Reports

### Before Reporting
1. **Search existing issues** to avoid duplicates
2. **Test with latest version**
3. **Try to reproduce** the issue consistently

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Node.js version: [e.g. 18.17.0]
- Project version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or screenshots.
```

## 🎯 Areas for Contribution

### High Priority
- 🐛 **Bug fixes** - Help identify and resolve issues
- 📚 **Documentation** - Improve guides and API documentation
- 🧪 **Testing** - Add unit and integration tests
- ♿ **Accessibility** - Improve app accessibility

### Feature Ideas
- 📱 **Mobile app** - React Native implementation
- 🔔 **Push notifications** - Browser notifications for new messages
- 🎨 **Themes** - Dark mode and custom themes
- 🔊 **Voice messages** - Audio message support
- 📹 **Video calls** - WebRTC video calling
- 🌍 **Internationalization** - Multi-language support
- 📊 **Analytics** - User engagement analytics
- 🤖 **Bot integration** - Chatbot functionality

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For general questions and ideas
- **Discord/Slack** - For real-time community chat (if available)

## 📄 License

By contributing to Alpha-Chats, you agree that your contributions will be licensed under the same ISC License that covers the project.

---

Thank you for contributing to Alpha-Chats! 🎉
