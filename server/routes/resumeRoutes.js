const express = require("express");
const router = express.Router();
const { getUntouchedLeads, getTouchedLeads, markAsTouched, markAsCompleted, startWork, getCompletedLeads } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/untouched", getUntouchedLeads);
router.get("/touched", getTouchedLeads);
router.get("/completed", getCompletedLeads);
router.put("/mark-touched/:id", markAsTouched);
router.put("/mark-completed/:id", markAsCompleted);
router.put("/start-work/:id", startWork);

module.exports = router;