const Candidate = require('../models/Candidate');

exports.getUntouchedLeads = async (req, res) => {
    try {
        const untouchedLeads = await Candidate.find({
            movedToTraining: true,
            movedToCV: false,
            touchedByResume: false
        }).populate("leadId");

        console.log(`Untouched Leads Count: ${untouchedLeads.length}`);

        res.status(200).json(untouchedLeads);
    } catch (error) {
        console.error("Error fetching untouched leads:", error);
        res.status(500).json({ message: "Error fetching untouched leads" });
    }
};

exports.getTouchedLeads = async (req, res) => {
    try {
        const touchedLeads = await Candidate.find({
            movedToTraining: true,
            touchedByResume: true,
            endDate: null
        }).populate("leadId");

        console.log(`Touched Leads Count: ${touchedLeads.length}`);

        res.status(200).json(touchedLeads);
    } catch (error) {
        console.error("Error fetching touched leads:", error);
        res.status(500).json({ message: "Error fetching touched leads" });
    }
};

exports.getCompletedLeads = async (req, res) => {
    try {
        const completedLeads = await Candidate.find({
            movedToTraining: true,
            movedToCV: false,
            touchedByResume: true,
            endDate: { $ne: null }
        }).populate("leadId");

        console.log(`Completed Leads Count: ${completedLeads.length}`);
        res.status(200).json(completedLeads);
    } catch (error) {
        console.error("Error fetching completed leads:", error);
        res.status(500).json({ message: "Error fetching completed leads" });
    }
};

exports.markAsTouched = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, callOutcome } = req.body;

        const updated = await Candidate.findByIdAndUpdate(id, {
            touchedByResume: true,
            notes,
            lastCallOutcome: callOutcome,
            lastCallDate: new Date(),
            startDate: new Date(),
            endDate: null,
            status: "touched"
        }, { new: true }).populate("leadId");

        if (!updated) return res.status(404).json({ message: "Candidate not found" });

        res.status(200).json({
            message: "Lead moved to touched successfully",
            candidate: updated,
        });
    } catch (error) {
        console.error("Error marking lead as touched", error);
        res.status(500).json({ message: "Error marking lead as touched" });
    }
};

exports.markAsCompleted = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Candidate.findByIdAndUpdate(id,
            {
                endDate: new Date(),
                status: "completed"
            },
            { new: true }
        ).populate("leadId");

        if (!updated) return res.status(404).json({ message: "Candidate not found" });

        res.status(200).json({
            message: "Lead marked as completed successfully",
            candidate: updated,
        });
    } catch (error) {
        console.error("Error marking as completed", error);
        res.status(500).json({ message: "Error marking as completed" });
    }
};

exports.startWork = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Candidate.findByIdAndUpdate(
            id,
            {
                startDate: new Date(),
                status: "in-progress"
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Candidate not found" });

        res.status(200).json({ message: "Work started successfully", candidate: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error starting work" });
    }
};

