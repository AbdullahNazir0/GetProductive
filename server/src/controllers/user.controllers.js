import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (
    [firstName, email, password]
      .some(field => field?.trim() === '')
  ) {
    throw new ApiError(400, 'Please provide all required fields')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new ApiError(409, 'User with email already exists')
  }

  const user = await User.create({
    firstName: firstName.toLowerCase(),
    lastName: lastName?.toLowerCase(),
    email: email.toLowerCase(),
    password,
    isEmailVerified: true // true for now
  })

  const createdUser = await User.findById({ _id: user._id})
    .select('-password')

  if(!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user')
  }

  res.status(201).json(
    new ApiResponse(201, createdUser, 'User registered successfully')
  )
})

const verifyEmail = asyncHandler(async (req, res) => {
  // coming soon
  // for now users emails will be verified by default.
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password} = req.body

  if (
    [email, password]
      .some(field => field?.trim === '')
  ) {
    throw new ApiError(400, 'Please provide all required fields')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const token = await user.generateToken()

  res.status(200)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    })
    .json(
    new ApiResponse(200, { token }, 'User logged in successfully')
  )
})

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200)
    .cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0
    })
    .json(
      new ApiResponse(200, {}, 'User logged out successfully')
  )
})

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, email } = req.body

  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  user.firstName = firstName || user.firstName
  user.lastName = lastName || user.lastName
  user.email = email || user.email

  const updatedUser = await user.save()
  if (!updatedUser) {
    throw new ApiError(500, 'Failed to update user')
  }

  res.status(200).json(
    new ApiResponse(200, updatedUser, 'User updated successfully')
  )
})

const resetPassword = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { password } = req.body

  if(!password) {
    throw new ApiError(400, 'Password is required')
  }

  if(password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long')
  }

  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  user.password = password
  await user.save()

  res.status(200).json(
    new ApiResponse(200, {}, 'Password reset successfully')
  )
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const deletedUser = await user.deleteOne()
  if(!deletedUser) {
    throw new ApiError(500, 'Failed to delete user')
  }

  res.status(200).json(
    new ApiResponse(200, {}, 'User deleted successfully')
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  resetPassword,
  deleteUser
}
