const router = require('express').Router()
const { protect } = require('../middleware/auth')
const Task = require('../models/Task')

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('lead', 'name phone').sort({ dueDate: 1 })
    res.json(tasks)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedTo: req.user._id })
    res.status(201).json(task)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/:id/done', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { isDone: true }, { new: true })
    res.json(task)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
