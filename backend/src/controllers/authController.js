const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const user = await authService.registerUser(name, email, password, address);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { address } = req.body;
    
    // Find the current user
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields
    if (address !== undefined) {
      user.address = address;
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  updateProfile,
};
