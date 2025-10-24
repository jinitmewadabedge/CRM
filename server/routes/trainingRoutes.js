const express = require('express');
const router = express.Router();
const { getAllTrainingLeads, deleteTrainingLead } = require("../controllers/trainingController");
const { getAllCVs } = require('../controllers/cvController');

router.get("/", getAllTrainingLeads);
router.get("/allcvs", getAllCVs);
router.delete("/delete/:id", deleteTrainingLead);

module.exports = router;