const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true, unique: true },
  city:    { type: String },
  project: { type: String },
  budget:  { type: String },
  source:  {
    type: String,
    enum: ['Facebook', 'WhatsApp', 'Website', 'Manual', 'Other'],
    default: 'Manual'
  },
  status: {
    type: String,
    enum: ['New','Contacted','Follow-up','Interested','Hot Mature','Closed','Not Interested'],
    default: 'New'
  },
  assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followUpDate: { type: Date },
  isOverdue:    { type: Boolean, default: false },
  notes:        [noteSchema],
}, { timestamps: true })

module.exports = mongoose.model('Lead', leadSchema)
