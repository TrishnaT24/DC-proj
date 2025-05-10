const User = require('../models/User');

// Add/register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate role
    if (!['leader', 'member'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either leader or member' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};




// User Login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
