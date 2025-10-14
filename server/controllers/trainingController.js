const Training = require("../models/Training");
const CV = require("../models/Candidate");

exports.getAllTrainingLeads = async (req, res) => {
    try {
        const trainingLeads = await Training.find().populate("candidateId");
        res.status(200).json(trainingLeads);
    } catch (error) {
        console.error("Error fetching training leads", error);
        res.status(500).json({ message: "Error fetching training leads" });
    }
};

exports.getAllCVs = async (req, res) => {
    try {
        const cvs = await CV.find()
            .populate("candidateId")
            .sort({ createdAt: -1 });

        res.status(200).json(cvs);
    } catch (error) {
        console.error("Error fetching CVs:", error);
        res.status(500).json({ message: "Error fetching CVs" });
    }
};