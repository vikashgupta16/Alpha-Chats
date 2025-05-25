// MongoDB initialization script
// This script runs when the container starts for the first time

db = db.getSiblingDB('alpha-chats');

// Create collections with indexes for better performance
db.createCollection('users');
db.createCollection('conversations');
db.createCollection('messages');

// Create indexes for better query performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

db.conversations.createIndex({ "participants": 1 });
db.conversations.createIndex({ "lastMessage": 1 });
db.conversations.createIndex({ "updatedAt": -1 });

db.messages.createIndex({ "conversation": 1 });
db.messages.createIndex({ "sender": 1 });
db.messages.createIndex({ "createdAt": -1 });
db.messages.createIndex({ "conversation": 1, "createdAt": -1 });

print('Database initialization completed successfully!');
