const User = require('../models/User');

// POST /api/users - Create a new user
const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const trimmedUsername = username.trim();

    // Check if user already exists
    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username: trimmedUsername });
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).json({ message: 'Server error creating user' });
  }
};

// GET /api/users - Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ message: 'Server error fetching users' });
  }
};

module.exports = {
  createUser,
  getUsers
};
