const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (name, email, password, address) => {
  // Check if user exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    token: generateToken(user.id),
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      token: generateToken(user.id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

module.exports = {
  registerUser,
  loginUser,
};
