# Alpha-Chat Project Structure

This project is organized with a clear separation between frontend, backend, and testing concerns.

## Directory Structure

```
Alpha-Chat/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── Hooks/           # Custom React hooks
│   │   ├── redux/           # Redux state management
│   │   └── __tests__/       # Frontend unit tests
│   └── package.json         # Frontend dependencies
│
├── backend/                  # Node.js backend application
│   ├── controllers/         # API controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middlewares/         # Express middlewares
│   ├── config/              # Configuration files
│   ├── tests/               # Backend-specific tests
│   └── package.json         # Backend dependencies
│
├── tests/                    # Integration tests
│   ├── test-complete-functionality.js
│   ├── test-enhanced-features.js
│   └── test-fix-verification.js
│
└── package.json             # Root dependencies (minimal)
```

## Running Tests

### Backend Tests
```bash
cd backend/tests
npm install
npm run test        # Run messaging tests
npm run test:users  # Create test users
npm run test:all    # Run all backend tests
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
cd tests
npm install
npm run test            # Run complete functionality test
npm run test:enhanced   # Test enhanced features
```

## Development

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## Features

- Real-time messaging with Socket.IO
- Code syntax highlighting
- Terminal command sharing
- Dark/Light theme support
- Online user presence
- Typing indicators
- Unread message counts
- End-to-end encryption ready
