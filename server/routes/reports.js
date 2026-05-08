const router = require('express').Router()
const { protect, roleGuard } = require('../middleware/auth')
const Lead = require('../models/Lead')

router.get('/summary', protect, async (req, res) => {
  try {
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    const total = await Lead.countDocuments()
    const today = new Date(); today.setHours(0,0,0,0)
    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: today } })
    res.json({ statusCounts, total, todayLeads })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.get('/operators', protect, roleGuard('admin','owner'), async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: '$assignedTo', total: { $sum: 1 },
        closed: { $sum: { $cond: [{ $eq: ['$status','Closed'] }, 1, 0] } }
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' }},
      { $unwind: '$user' },
      { $project: { name: '$user.name', total: 1, closed: 1 }}
    ])
    res.json(data)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
