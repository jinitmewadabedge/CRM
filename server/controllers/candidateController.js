const Candidate = require("../models/Candidate");
const Lead = require("../models/Lead");

exports.enrollCandidate = async (req, res) => {

    try {
        const {
            leadId,
            enrollmentDate,
            plan,
            upfront,
            contracted,
            percentage,
            paymentGateway,
            salesPerson,
            TL,
            manager,
            enrollmentForm,
            jobGuarantee,
            movedToCV,
            movedToTraining,
            technology,
            paymentType,
            reference,
            paymentStatus
        } = req.body;


        const lead = await Lead.findById(leadId);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const existingCandidate = await Candidate.findOne({ leadId });

        if (existingCandidate) {
            return res.status(404).json({ message: "Lead already enrolled." })
        }

        const newCandidate = new Candidate({
            name: lead.candidate_name,
            email: lead.candidate_email,
            phone: lead.candidate_phone_no,
            technology: lead.technology,
            leadId: lead._id,
            enrollmentDate: req.body.enrollmentDate,
            plan: req.body.plan,
            upfront: req.body.upfront,
            contracted: req.body.contracted,
            percentage: req.body.percentage,
            paymentGateway: req.body.paymentGateway,
            salesPerson: req.body.salesPerson || null,
            TL: req.body.TL || null,
            manager: req.body.manager || null,
            enrollmentForm: req.body.enrollmentForm,
            jobGuarantee: req.body.jobGuarantee,
            movedToCV: req.body.movedToCV,
            movedToTraining: req.body.movedToTraining,
            paymentType: req.body.paymentType,
            reference: req.body.reference,
            paymentStatus: req.body.paymentStatus
        });



        await newCandidate.save();

        lead.status = "Enrolled";
        await lead.save();

        res.status(201).json({
            message: "Candidate enrolled successfully",
            candidate: newCandidate
        });
    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).json({ message: "Error enrolling candidate" });
    }
}

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate("leadId salesPerson TL manager");
        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Error fetching candidates" });
    }
}

exports.updateCandidateStage = async (req, res) => {
    try {

        const { candidateId } = req.params;
        const { movedToCV, movedToTraining } = req.body;

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (!movedToCV !== undefined) candidate.movedToCV = movedToCV;
        if (movedToTraining !== undefined) candidate.movedToTraining = movedToTraining;

        await candidate.save();

        res.status(200).json({ message: "Candidate stage updated successfully", candidate });
    } catch (error) {
        res.status(500).json({ message: "Error updating candidate stage", error });
    }
};