// Quick script to clear conversations collection to fix schema issues
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Conversation from '../models/connversation.model.js'

dotenv.config()

const clearConversations = async () => {
  try {    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL)
    console.log('✅ Connected to MongoDB')
    
    // Clear all conversations
    const result = await Conversation.deleteMany({})
    console.log(`🗑️ Deleted ${result.deletedCount} conversations`)
    
    console.log('✨ Database cleared successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    process.exit(1)
  }
}

clearConversations()
