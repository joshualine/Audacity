const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');


// @description     Register a new user
// @route           POST /api/users
// @access          public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, monoId, monoCode, monoReauthToken, } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const user = await User.create({
    email,
    password,
    monoId,
    monoCode,
    monoReauthToken,
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      password: user.password,
      monoId: user.monoId,
      monoStatus: user.monoStatus,
      monoReauthToken: user.monoReauthToken,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Authenticated user/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.email = req.body.email || user.email
    user.monoId = req.body.monoId || user.monoId
    user.monoCode = req.body.monoCode || user.monoCode
    user.monoStatus = req.body.monoStatus || user.monoStatus
    user.monoReauthToken = req.body.monoReauthToken || user.monoReauthToken

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      monoId: updatedUser.monoId,
      monoCode: updatedUser.monoCode,
      monoStatus: updatedUser.monoStatus,
      monoReauthToken: updatedUser.monoReauthToken,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      monoId: user.monoId,
      monoCode: user.monoCode,
      monoStatus: user.monoStatus,
      monoReauthToken: user.monoReauthToken,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Authenticated user
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      monoId: user.monoId,
      monoCode: user.monoCode,
      monoStatus: user.monoStatus,
      monoReauthToken: user.monoReauthToken,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Authenticated user
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.email = req.body.email || user.email
    user.monoId = req.body.monoId || user.monoId
    user.monoCode = req.body.monoCode || user.monoCode
    user.monoStatus = req.body.monoStatus || user.monoStatus
    user.monoReauthToken = req.body.monoReauthToken || user.monoReauthToken


    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      email: updatedUser.firstname,
      monoId: updatedUser.monoId,
      monoCode: updatedUser.monoCode,
      monoStatus: updatedUser.monoStatus,
      monoReauthToken: updatedUser.monoReauthToken,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


module.exports = {
  getUsers,
  registerUser,
  getUserById,
  updateUser,
  deleteUser,

  authUser,
  getUserProfile,
  updateUserProfile
}