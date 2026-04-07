// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedDB = async () => {
  try {
    // Step 1: Connect to MongoDB
    await connectDB();
    console.log('✅ DB connected');

    // Step 2: Clear existing test data
    await User.deleteMany({ email: 'seedtest@example.com' });
    console.log('🧹 Cleaned up old seed data');

    // Step 3: WRITE — Create a test user
    const testUser = await User.create({
      username: 'seeduser',
      email: 'seedtest@example.com',
      passwordHash: 'placeholder_hash', // not a real login — just testing DB write
      googleId: null,
    });
    console.log('✅ WRITE successful — User created:', testUser._id);

    // Step 4: READ — Fetch the user back from DB
    const foundUser = await User.findOne({ email: 'seedtest@example.com' });
    console.log('✅ READ successful — User found:', foundUser.username, foundUser.email);

    // Step 5: Clean up — remove test user
    await User.deleteOne({ _id: testUser._id });
    console.log('🧹 Seed user removed — DB is clean');

    console.log('\n🎉 Phase 2 Milestone PASSED: DB read/write works correctly!');

  } catch (err) {
    console.error('❌ Seed script failed:', err.message);
  } finally {
    // Always close the connection when done
    mongoose.connection.close();
    console.log('🔌 DB connection closed');
  }
};

seedDB();