const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createLead, getLeadById, getLeads, updateLead, deleteLead, activeLeadCount, importLeads, unassigned, assign, myleads } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get('/active-lead-count', activeLeadCount);
router.get("/unassigned", unassigned);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/import', importLeads);
router.post("/assign/:id", assign);
router.get("/myleads", myleads);

module.exports = router;