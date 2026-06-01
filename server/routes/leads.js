const router = require('express').Router()
const { protect, roleGuard } = require('../middleware/auth')
const { 
  getLeads, 
  createLead, 
  capturePublicLead, 
  getLeadById, 
  updateStatus, 
  assignLead, 
  updateLead, 
  addNote 
} = require('../controllers/leadController')

// Public webhook endpoint for external captures (no auth required)
router.post('/capture', capturePublicLead)

// Protected routes
router.get('/',    protect, getLeads)
router.post('/',   protect, roleGuard('admin','operator'), createLead)
router.get('/:id', protect, getLeadById)

// Update operations
router.patch('/:id', protect, roleGuard('admin','operator'), updateLead)
router.patch('/:id/status', protect, roleGuard('admin','operator'), updateStatus)
router.patch('/:id/assign', protect, roleGuard('admin'), assignLead)

// Notes
router.post('/:id/notes',   protect, roleGuard('admin','operator'), addNote)

module.exports = router
