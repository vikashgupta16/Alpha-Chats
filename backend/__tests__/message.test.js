const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

describe('Message Routes', () => {
  let authToken;
  let testUser;
  let otherUser;

  beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/alpha-chats-test';
    await mongoose.connect(MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear all collections
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('messages').deleteMany({});
    await mongoose.connection.db.collection('conversations').deleteMany({});

    // Create test users
    testUser = await User.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      gender: 'male'
    });

    otherUser = await User.create({
      name: 'Other User',
      username: 'otheruser',
      email: 'other@example.com',
      password: 'password123',
      gender: 'female'
    });

    // Generate auth token
    authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET || 'test-secret');
  });

  describe('POST /api/message/send/:id', () => {
    it('should send a message to another user', async () => {
      const messageText = 'Hello, this is a test message!';

      const response = await request(app)
        .post(`/api/message/send/${otherUser._id}`)
        .set('Cookie', `token=${authToken}`)
        .send({ message: messageText })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.newMessage.message).toBe(messageText);
      expect(response.body.newMessage.sender.toString()).toBe(testUser._id.toString());
      expect(response.body.newMessage.receiver.toString()).toBe(otherUser._id.toString());
    });

    it('should return error when sending message to non-existent user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/message/send/${fakeUserId}`)
        .set('Cookie', `token=${authToken}`)
        .send({ message: 'Test message' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });

    it('should return error when message is empty', async () => {
      const response = await request(app)
        .post(`/api/message/send/${otherUser._id}`)
        .set('Cookie', `token=${authToken}`)
        .send({ message: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Message is required');
    });
  });

  describe('GET /api/message/:id', () => {
    it('should get messages between two users', async () => {
      // First send a message
      await request(app)
        .post(`/api/message/send/${otherUser._id}`)
        .set('Cookie', `token=${authToken}`)
        .send({ message: 'Test message' });

      const response = await request(app)
        .get(`/api/message/${otherUser._id}`)
        .set('Cookie', `token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.messages.length).toBe(1);
      expect(response.body.messages[0].message).toBe('Test message');
    });

    it('should return empty array when no messages exist', async () => {
      const response = await request(app)
        .get(`/api/message/${otherUser._id}`)
        .set('Cookie', `token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.messages.length).toBe(0);
    });
  });
});
