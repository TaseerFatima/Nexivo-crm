const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  lead:       { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true },
  dueDate:    { type: Date, required: true },
  isDone:     { type: Boolean, default: false },
  isOverdue:  { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
