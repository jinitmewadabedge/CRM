const express = require('express');
const router = express.Router();
const { getAllTrainingLeads } = require("../controllers/trainingController");
const { getAllCVs } = require('../controllers/cvController');

router.get("/", getAllTrainingLeads);
router.get("/allcvs", getAllCVs);

module.exports = router;