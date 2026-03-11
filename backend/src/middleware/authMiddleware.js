const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // If the user accidentally pasted the token with dictionary quotes from Postman like "eyJ..." it will fail verification.
      token = token.replace(/(^"|"$)/g, '').trim(); // Strips literal quotes and whitespace

      console.log("Token Received: ", token);

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = { id: decoded.id };
      return next();
    } catch (error) {
      console.error('JWT Error: ', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
