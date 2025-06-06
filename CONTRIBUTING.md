# Contributing to Alpha-Chats 🚀

Thank you for your interest in contributing to Alpha-Chats! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/alpha-chats.git
cd alpha-chats
```

### 2. Set Up Development Environment
```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Development Workflow
```bash
# Start development servers
npm run dev

# Run tests
npm run test:all

# Before committing
npm run test
```

## 📋 Development Guidelines

### Code Style
- **JavaScript/React**: Follow existing patterns in the codebase
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Comments**: Write clear, concise comments for complex logic
- **File Structure**: Follow the established folder structure

### Component Guidelines
```jsx
// ✅ Good - Functional component with proper structure
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function MyComponent({ prop1, prop2 }) {
  const [localState, setLocalState] = useState('')
  const { globalState } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    // Effect logic
  }, [dependency])

  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  )
}

export default MyComponent
```

### API Guidelines
```javascript
// ✅ Good - Consistent error handling
export const controllerFunction = async (req, res) => {
  try {
    // Controller logic
    return res.status(200).json({ data: result })
  } catch (error) {
    console.error('Error in controllerFunction:', error)
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    })
  }
}
```

## 🧪 Testing

### Running Tests
```bash
# All tests
npm run test:all

# Backend tests only
npm run test:backend

# Integration tests only
npm run test
```

### Writing Tests
- Write tests for new features
- Test both success and error cases
- Use descriptive test names
- Follow existing test patterns

## 🎨 UI/UX Guidelines

### Design Principles
- **Terminal Aesthetic**: Maintain the developer-focused terminal theme
- **Responsive Design**: Ensure mobile-first approach
- **Performance**: Optimize for fast loading and smooth interactions
- **Accessibility**: Follow basic accessibility principles

### Color Scheme
```css
/* Primary Colors */
--primary-green: #39ff14    /* Matrix green */
--primary-yellow: #ffe156   /* Warning yellow */
--primary-orange: #ff6f3c   /* Accent orange */

/* Background Colors */
--bg-primary: #181c2f       /* Dark blue */
--bg-secondary: #23234a     /* Medium blue */
--bg-tertiary: #2d1e60      /* Purple tint */

/* Text Colors */
--text-primary: #ffffff     /* White */
--text-secondary: #b3b3ff   /* Light blue */
--text-muted: #7f53ac       /* Purple */
```

## 🚀 Feature Requests

### Before Submitting
1. Check existing issues and pull requests
2. Discuss major changes in issues first
3. Consider backward compatibility
4. Think about mobile responsiveness

### Feature Request Template
```markdown
## Feature Description
Brief description of the feature

## Use Case
Why is this feature needed?

## Proposed Implementation
How should this be implemented?

## Additional Context
Any additional information or screenshots
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 18.17.0]

## Additional Context
Screenshots, console logs, etc.
```

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(chat): add typing indicators
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
style(sidebar): improve responsive design
```

## 🔍 Pull Request Process

### Before Submitting
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] No console errors
- [ ] Mobile responsive (if UI changes)

### PR Template
```markdown
## Description
What does this PR do?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

## 📞 Getting Help

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the maintainer

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🎯 Priority Areas

Currently looking for contributions in:
- [ ] End-to-end encryption implementation
- [ ] Voice/Video calling features
- [ ] Performance optimizations
- [ ] Mobile app development
- [ ] Advanced search functionality
- [ ] Integration tests expansion

---

**Thank you for contributing to Alpha-Chats! Your efforts help make this project better for the entire developer community.** 🙏
