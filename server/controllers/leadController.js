const Lead = require('../models/Lead')

const getLeads = async (req, res) => {
  try {
    const { status, city, project, assignedTo, search } = req.query
    const filter = {}
    if (status)     filter.status = status
    if (city)       filter.city   = new RegExp(city, 'i')
    if (project)    filter.project = new RegExp(project, 'i')
    if (assignedTo) filter.assignedTo = assignedTo
    if (search)     filter.$or = [
      { name:  new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
    ]
    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
    res.json(leads)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createLead = async (req, res) => {
  try {
    const duplicate = await Lead.findOne({ phone: req.body.phone })
    if (duplicate)
      return res.status(400).json({ message: 'Lead already exists with this phone', lead: duplicate })
    const lead = await Lead.create(req.body)
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name')
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    )
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const assignLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, { assignedTo: req.body.assignedTo }, { new: true }
    ).populate('assignedTo', 'name email')
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    lead.notes.push({ text: req.body.text, createdBy: req.user._id })
    await lead.save()
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getLeads, createLead, getLeadById, updateStatus, assignLead, addNote }
