const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };
