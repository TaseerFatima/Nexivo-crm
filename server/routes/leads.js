const router = require('express').Router()
const { protect, roleGuard } = require('../middleware/auth')
const { getLeads, createLead, getLeadById, updateStatus, assignLead, addNote } = require('../controllers/leadController')

router.get('/',    protect, getLeads)
router.post('/',   protect, roleGuard('admin','operator'), createLead)
router.get('/:id', protect, getLeadById)
router.patch('/:id/status', protect, roleGuard('admin','operator'), updateStatus)
router.patch('/:id/assign', protect, roleGuard('admin'), assignLead)
router.post('/:id/notes',   protect, roleGuard('admin','operator'), addNote)

module.exports = router
