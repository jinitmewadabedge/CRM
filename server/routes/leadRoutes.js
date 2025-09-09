const express = require('express');
const router = express.Router();
const { createLead, getLeadById, getLeads, updateLead, deleteLead, activeLeadCount, importLeads } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get('/active-lead-count', activeLeadCount);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/import', importLeads);

module.exports = router;