const express = require('express');
const { enrollCandidate, getAllCandidates } = require("../controllers/candidateController");
const { protect, authorizedRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/enroll", protect, enrollCandidate);
router.get("/", protect, getAllCandidates);

module.exports = router;
