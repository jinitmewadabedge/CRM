const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");

router.get("/", cvController.getAllCVs);
router.get("/:candidateId", cvController.getCVByCandidateId);

module.exports = router;
