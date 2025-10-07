const express = require('express');
const router = express.Router();
const { authMiddleware, protect } = require('../middleware/authMiddleware');
const { createLead, getAssignedLeads, getLeadState, assignLeads, myleads, getLeadById, getLeads, updateLead, deleteLead, activeLeadCount, importLeads, getUnassignedLeads, assignLead, addCallOutcome, LeadIdOnly, bulkAssignLeads, getUnassignedLeadIds, getAssignedLeadIds, bulkDeleteLeads } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get("/idsOnly", protect, LeadIdOnly);
router.get("/unassignedIds", protect, getUnassignedLeadIds);
router.get("/assignedIds", protect, getAssignedLeadIds);
router.get('/active-lead-count', activeLeadCount);
router.post('/import', importLeads);
router.get("/myleads", protect, myleads);
router.get("/stats", protect, getLeadState);
router.get("/unassigned", protect, getUnassignedLeads);
router.get("/assigned", protect, getAssignedLeads);
router.post("/assign/:leadId", protect, assignLeads);
router.get('/:id', getLeadById);
router.put("/bulk-assign", protect, bulkAssignLeads);
router.post("/bulk-delete", protect, bulkDeleteLeads);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post("/:id/call", protect, addCallOutcome);

module.exports = router;