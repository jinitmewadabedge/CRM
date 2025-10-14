const express = require('express');
const { enrollCandidate, getAllCandidates, updateCandidateStage } = require("../controllers/candidateController");
const { protect, authorizedRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/enroll", protect, enrollCandidate);
router.get("/", protect, getAllCandidates);
router.put("/update-stage/:candidateId", protect, updateCandidateStage);

module.exports = router;
