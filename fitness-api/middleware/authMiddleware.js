const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Temporary testing version - DO NOT USE IN PRODUCTION
const protect = async (req, res, next) => {
    try {
      let token;
  
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Temporarily set user ID without database check
        req.user = { id: decoded.id };
        console.log('Debug: Setting user ID without DB check:', decoded.id);
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, no token' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
module.exports = { protect };
