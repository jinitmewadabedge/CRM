const express = require("express");
const router = express.Router();
const { getUntouchedLeads, getTouchedLeads, markAsTouched, markAsCompleted, startWork, getCompletedLeads, movedToMarketing, movedBackToResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/untouched", getUntouchedLeads);
router.get("/touched", getTouchedLeads);
router.get("/completed", getCompletedLeads);
router.put("/mark-touched/:id", markAsTouched);
router.put("/mark-completed/:id", markAsCompleted);
router.put("/start-work/:id", startWork);
router.put("/movedToMarketing/:id", movedToMarketing);
router.put("/moveBackToResume/:id", movedBackToResume);

module.exports = router;