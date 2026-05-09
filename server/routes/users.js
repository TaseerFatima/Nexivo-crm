// routes/users.js
const router = require('express').Router();
const { protect, roleGuard } = require('../middleware/auth');
const { register } = require('../controllers/authController'); // Reuse your existing register logic
const User = require('../models/User');

// Only Admins can create new users (Operators/Owners)
router.post('/create', protect, roleGuard('admin'), register);

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

// const router = require('express').Router()
// const { protect } = require('../middleware/auth')
// const User = require('../models/User')

// router.get('/', protect, async (req, res) => {
//   try {
//     const users = await User.find({ isActive: true }).select('-password')
//     res.json(users)
//   } catch (err) { res.status(500).json({ message: err.message }) }
// })

// router.get('/me', protect, (req, res) => res.json(req.user))

// module.exports = router
