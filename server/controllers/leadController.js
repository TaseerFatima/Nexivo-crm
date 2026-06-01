const Lead = require('../models/Lead')
const User = require('../models/User');

// Helper to clean phone numbers to digits only
const cleanPhoneNumber = (phone) => {
  return phone ? phone.replace(/\D/g, '') : '';
};

// Helper to sync overdue status of leads in real-time
const syncOverdueLeads = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Set isOverdue: true for leads whose follow-up date is in the past and status is not Closed/Not Interested
    await Lead.updateMany(
      { 
        followUpDate: { $lt: today }, 
        status: { $nin: ['Closed', 'Not Interested'] }, 
        isOverdue: false 
      },
      { isOverdue: true }
    );

    // Reset isOverdue: false for leads whose follow-up date is today/future, null, or status is Closed/Not Interested
    await Lead.updateMany(
      { 
        $or: [
          { followUpDate: { $gte: today } },
          { followUpDate: null },
          { status: { $in: ['Closed', 'Not Interested'] } }
        ], 
        isOverdue: true 
      },
      { isOverdue: false }
    );
  } catch (err) {
    console.error('Error syncing overdue leads:', err.message);
  }
};

const getLeads = async (req, res) => {
  try {
    // 1. Sync overdue states dynamically on lead lookup
    await syncOverdueLeads();

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
      const cleanedSearch = search.replace(/\D/g, '');
      const searchConditions = [
        { name: new RegExp(search, 'i') }
      ];
      if (cleanedSearch) {
        searchConditions.push({ phone: new RegExp(cleanedSearch, 'i') });
      } else {
        searchConditions.push({ phone: new RegExp(search, 'i') });
      }
      filter.$or = searchConditions;
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper for finding operator with the lightest workload (round-robin auto-allocation)
const getAutoAssignmentOperator = async () => {
  const activeOperators = await User.find({ role: 'operator', isActive: true });
  if (activeOperators.length === 0) return null;

  const operatorWorkloads = await Lead.aggregate([
    { $match: { status: { $nin: ['Closed', 'Not Interested'] } } }, // Only count open active leads
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
  ]);

  const workloadMap = {};
  operatorWorkloads.forEach(op => {
    if (op._id) workloadMap[op._id.toString()] = op.count;
  });

  activeOperators.sort((a, b) => {
    const countA = workloadMap[a._id.toString()] || 0;
    const countB = workloadMap[b._id.toString()] || 0;
    return countA - countB;
  });

  return activeOperators[0]._id;
};

// Internal/Manual lead creation (authenticated)
const createLead = async (req, res) => {
  try {
    const { phone, name, city, project, budget, source } = req.body;
    let { assignedTo } = req.body;
    
    const cleanPhone = cleanPhoneNumber(phone);
    if (!cleanPhone) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    // Duplicate detection (Requirement #12)
    const duplicate = await Lead.findOne({ phone: cleanPhone })
      .populate('assignedTo', 'name');
      
    if (duplicate) {
      return res.status(400).json({ 
        message: `Duplicate detected! This lead already exists and is assigned to ${duplicate.assignedTo?.name || 'Unassigned'}.`,
        lead: duplicate 
      });
    }

    // Auto-assignment
    if (!assignedTo) {
      assignedTo = await getAutoAssignmentOperator();
    }

    const lead = await Lead.create({
      name,
      phone: cleanPhone,
      city,
      project,
      budget,
      source: source || 'Manual',
      assignedTo
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public unauthenticated webhook lead capture (Facebook Ads, Website forms, WhatsApp inbound)
const capturePublicLead = async (req, res) => {
  try {
    const { phone, name, city, project, budget, source } = req.body;
    
    const cleanPhone = cleanPhoneNumber(phone);
    if (!cleanPhone || !name) {
      return res.status(400).json({ message: 'Name and Phone number are required.' });
    }

    // Duplicate detection
    const duplicate = await Lead.findOne({ phone: cleanPhone })
      .populate('assignedTo', 'name');
      
    if (duplicate) {
      return res.status(400).json({ 
        message: `Duplicate detected! This lead already exists and is assigned to ${duplicate.assignedTo?.name || 'Unassigned'}.`,
        lead: duplicate 
      });
    }

    // Auto-assignment using round robin workload algorithm
    const assignedTo = await getAutoAssignmentOperator();

    const lead = await Lead.create({
      name,
      phone: cleanPhone,
      city,
      project,
      budget,
      source: source || 'Website',
      assignedTo
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    await syncOverdueLeads();

    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, { assignedTo: req.body.assignedTo }, { new: true }
    ).populate('assignedTo', 'name email');
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { name, phone, city, project, budget, source, status, followUpDate } = req.body;
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (city !== undefined) updateFields.city = city;
    if (project !== undefined) updateFields.project = project;
    if (budget !== undefined) updateFields.budget = budget;
    if (source !== undefined) updateFields.source = source;
    if (status !== undefined) updateFields.status = status;

    if (phone !== undefined) {
      const cleanPhone = cleanPhoneNumber(phone);
      if (!cleanPhone) {
        return res.status(400).json({ message: 'Phone number cannot be empty.' });
      }

      // Check if phone already exists under another lead
      const duplicate = await Lead.findOne({ phone: cleanPhone, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ message: 'Another lead with this phone number already exists!' });
      }
      updateFields.phone = cleanPhone;
    }

    if (followUpDate !== undefined) {
      updateFields.followUpDate = followUpDate ? new Date(followUpDate) : null;
      if (followUpDate) {
        const today = new Date().setHours(0, 0, 0, 0);
        const follow = new Date(followUpDate).setHours(0, 0, 0, 0);
        updateFields.isOverdue = follow < today && status !== 'Closed' && status !== 'Not Interested';
      } else {
        updateFields.isOverdue = false;
      }
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateFields, { new: true })
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes.push({ text: req.body.text, createdBy: req.user._id });
    await lead.save();
    
    const updatedLead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    res.status(201).json(updatedLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  capturePublicLead,
  getLeadById,
  updateStatus,
  assignLead,
  updateLead,
  addNote
};
