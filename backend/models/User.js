// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    googleId: {
      type: String,
      default: null,
      index: true,         // ✅ ADD: speeds up OAuth user lookups
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,     // keeping your choice — createdAt is manual above
  }
);

// ✅ ADD: Virtual field — never expose passwordHash accidentally
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

// ✅ ADD: Instance method — compare password at the model level
const bcrypt = require('bcryptjs');

userSchema.methods.comparePassword = async function (plainPassword) {
  // Re-fetch hash since select: false hides it by default
  const userWithHash = await this.model('User')
    .findById(this._id)
    .select('+passwordHash');
  return bcrypt.compare(plainPassword, userWithHash.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;