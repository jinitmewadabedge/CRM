const express = require('express');
const router = express.Router();
const { authMiddleware, protect } = require('../middleware/authMiddleware');
const { createLead, getLeadById, getLeads, updateLead, deleteLead, activeLeadCount, importLeads, unassigned, assign, myleads, assigned, getAssignedLeads, getUnassignedLeads, assignLeads } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get('/active-lead-count', activeLeadCount);
router.post('/import', importLeads);
router.get("/myleads", myleads);
router.get("/unassigned", getUnassignedLeads);
router.get("/assigned", getAssignedLeads);
router.post("/assign/:leadId", protect, assignLeads);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;