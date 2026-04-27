const User = require('../models/User');

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const sendAuthResponse = (res, statusCode, message, user, token) => {
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions())
    .json({
      success: true,
      message,
      user: {
        id: user._id, name: user.name, email: user.email,
        grade: user.grade, subjects: user.subjects,
        totalDoubts: user.totalDoubts, createdAt: user.createdAt,
      },
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, grade, subjects } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, grade, subjects });
  const token = user.generateToken();

  sendAuthResponse(res, 201, 'Account created successfully', user, token);
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = user.generateToken();

  sendAuthResponse(res, 200, 'Login successful', user, token);
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id, name: req.user.name, email: req.user.email,
      grade: req.user.grade, subjects: req.user.subjects,
      totalDoubts: req.user.totalDoubts, createdAt: req.user.createdAt,
    },
  });
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  res
    .clearCookie('token', cookieOptions())
    .json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };
