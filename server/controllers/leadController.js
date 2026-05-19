const Lead = require('../models/Lead')

const getLeads = async (req, res) => {
  try {
    const { status, city, project, assignedTo, search } = req.query;
    const filter = {};

    // --- ROLE-BASED LOGIC ---
    if (req.user.role === 'operator') {
      // Force the filter to ONLY show leads belonging to this operator
      filter.assignedTo = req.user._id;
    } else {
      // Admins and Owners can filter by any specific operator if they choose
      if (assignedTo) filter.assignedTo = assignedTo;
    }

    // --- GENERAL FILTERS ---
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, 'i');
    if (project) filter.project = new RegExp(project, 'i');
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createLead = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Clean phone input to prevent formatting bypasses (stripping spaces/dashes)
    const cleanPhone = phone.replace(/\D/g, '');

    // Duplicate detection check
    const duplicate = await Lead.findOne({ phone: new RegExp(cleanPhone, 'i') })
      .populate('assignedTo', 'name');
      
    if (duplicate) {
      return res.status(400).json({ 
        message: `Duplicate detected! This lead already exists and is assigned to ${duplicate.assignedTo?.name || 'Unassigned'}.`,
        lead: duplicate 
      });
    }

    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const getLeads = async (req, res) => {
//   try {
//     const { status, city, project, assignedTo, search } = req.query
//     const filter = {}
//     if (status)     filter.status = status
//     if (city)       filter.city   = new RegExp(city, 'i')
//     if (project)    filter.project = new RegExp(project, 'i')
//     if (assignedTo) filter.assignedTo = assignedTo
//     if (search)     filter.$or = [
//       { name:  new RegExp(search, 'i') },
//       { phone: new RegExp(search, 'i') },
//     ]
//     const leads = await Lead.find(filter)
//       .populate('assignedTo', 'name email')
//       .sort({ createdAt: -1 })
//     res.json(leads)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }



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
