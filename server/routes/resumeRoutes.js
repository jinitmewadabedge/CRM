const express = require("express");
const router = express.Router();
const { getUntouchedLeads, getTouchedLeads, markAsTouched, markAsCompleted, startWork, getCompletedLeads, movedToMarketing, movedBackToResume, assignToRecruiter, submitReport, getReportHistory } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/untouched", getUntouchedLeads);
router.get("/touched", getTouchedLeads);
router.get("/completed", getCompletedLeads);
router.get("/getReportHistory/:id", getReportHistory)
router.put("/mark-touched/:id", markAsTouched);
router.put("/mark-completed/:id", markAsCompleted);
router.put("/start-work/:id", startWork);
router.put("/movedToMarketing/:id", movedToMarketing);
router.put("/moveBackToResume/:id", movedBackToResume);
router.put("/assignToRecruiter/:id", protect, assignToRecruiter);
router.put("/report/:id", protect, submitReport);

module.exports = router;