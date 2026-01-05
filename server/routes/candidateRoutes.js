const express = require('express');
const { enrollCandidate, getAllCandidates, updateCandidateStage } = require("../controllers/candidateController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

console.log("✅ Candidate routes loaded");

router.post("/enroll", protect, enrollCandidate);
router.get("/", protect, getAllCandidates);
router.put("/update-stage/:candidateId", protect, updateCandidateStage);

module.exports = router;
