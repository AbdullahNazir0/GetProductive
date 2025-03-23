import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    minlength: 3
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 30,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 3,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY, algorithm: 'HS256' })
}

export const User = mongoose.model('User', UserSchema)
