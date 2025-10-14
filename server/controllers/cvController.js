const CV = require("../models/CV");
const Candidate = require("../models/Candidate");

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

exports.getCVByCandidateId = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const cv = await CV.findOne({ candidateId }).populate("candidateId");

        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }

        res.status(200).json(cv);
    } catch (error) {
        console.error("Error fetching CV:", error);
        res.status(500).json({ message: "Error fetching CV" });
    }
};