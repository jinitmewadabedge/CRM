const express = require('express');
const router = express.Router();
const { authMiddleware, protect } = require('../middleware/authMiddleware');
const { createLead, getAssignedLeads, getLeadState, assignLeads, myleads, getLeadById, getLeads, updateLead, deleteLead, activeLeadCount, importLeads, getUnassignedLeads, assignLead } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get('/active-lead-count', activeLeadCount);
router.post('/import', importLeads);
router.get("/myleads", protect, myleads);
router.get("/stats", protect, getLeadState);     
router.get("/unassigned", protect, getUnassignedLeads);
router.get("/assigned", protect, getAssignedLeads);   
router.post("/assign/:leadId", protect, assignLeads);
router.get('/:id', getLeadById); 
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);


module.exports = router;