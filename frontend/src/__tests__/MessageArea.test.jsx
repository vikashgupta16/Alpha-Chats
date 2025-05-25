import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MessageArea from '../components/MessageArea';
import userSlice from '../redux/userSlice';

// Mock Socket.io
jest.mock('../hooks/useSocket', () => ({
  __esModule: true,
  default: () => ({
    socket: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: {
        authUser: { _id: 'user1', name: 'Test User' },
        selectedUser: { _id: 'user2', name: 'Selected User' },
        messages: [
          {
            _id: 'msg1',
            message: 'Hello',
            sender: 'user1',
            receiver: 'user2',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'msg2',
            message: 'Hi there!',
            sender: 'user2',
            receiver: 'user1',
            createdAt: new Date().toISOString(),
          },
        ],
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (component, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('MessageArea Component', () => {
  it('renders correctly with selected user', () => {
    renderWithProvider(<MessageArea />);
    
    expect(screen.getByText('Selected User')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('shows "Select a chat" when no user is selected', () => {
    renderWithProvider(<MessageArea />, {
      selectedUser: null,
    });
    
    expect(screen.getByText('Select a chat to start messaging')).toBeInTheDocument();
  });

  it('allows typing in message input', () => {
    renderWithProvider(<MessageArea />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'New message' } });
    
    expect(input.value).toBe('New message');
  });

  it('sends message on form submit', () => {
    renderWithProvider(<MessageArea />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    const form = input.closest('form');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);
    
    expect(input.value).toBe(''); // Input should be cleared after submit
  });

  it('displays messages with correct styling for sender/receiver', () => {
    renderWithProvider(<MessageArea />);
    
    const messages = screen.getAllByTestId(/message-/);
    expect(messages).toHaveLength(2);
    
    // First message is from current user (should be on right)
    expect(messages[0]).toHaveClass('chat-end');
    
    // Second message is from other user (should be on left)
    expect(messages[1]).toHaveClass('chat-start');
  });

  it('shows loading state when messages are loading', () => {
    renderWithProvider(<MessageArea />, {
      loading: true,
    });
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
