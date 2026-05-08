const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired' })
    }
  }
  if (!token) return res.status(401).json({ message: 'No token, access denied' })
}

const roleGuard = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied for role: ${req.user.role}` })
  }
  next()
}

module.exports = { protect, roleGuard }
