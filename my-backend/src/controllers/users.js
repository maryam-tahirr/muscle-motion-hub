
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Create initial admin user if none exists
const createInitialAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Initial admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createInitialAdminUser,
  getUserById
};
