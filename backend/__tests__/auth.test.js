const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGO_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/alpha-chats-test';
    await mongoose.connect(MONGO_URI);
  });

  afterAll(async () => {
    // Clean up test database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await mongoose.connection.db.collection('users').deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should return error for invalid email', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return error when passwords do not match', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          gender: 'male'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });
  });
});
