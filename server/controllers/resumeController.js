const Candidate = require('../models/Candidate');
const { clearLeadStateCache } = require('../utils/cache');

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

// exports.markAsTouched = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { notes, callOutcome } = req.body;

//         const updated = await Candidate.findByIdAndUpdate(id, {
//             touchedByResume: true,
//             notes,
//             lastCallOutcome: callOutcome,
//             lastCallDate: new Date(),
//             startDate: new Date(),
//             endDate: null,
//             status: "touched"
//         }, { new: true }).populate("leadId");

//         if (!updated) return res.status(404).json({ message: "Candidate not found" });

//         res.status(200).json({
//             message: "Lead moved to touched successfully",
//             candidate: updated,
//         });
//     } catch (error) {
//         console.error("Error marking lead as touched", error);
//         res.status(500).json({ message: "Error marking lead as touched" });
//     }
// };

// exports.markAsTouched = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { callOutcome, duration, notes } = req.body;

//         const candidate = await Candidate.findById(id);
//         if (!candidate) return res.status(404).json({ message: "Candidate not found" });

//         if (!candidate.callHistory) candidate.callHistory = [];

//         candidate.callHistory.push({
//             outcome: callOutcome,
//             date: date || new Date(),
//             time: time | "",
//             duration: duration | "",
//             notes: notes || "",
//             createdAt: new Date(),
//         });

//         candidate.touchedByResume = true;
//         candidate.lastCallOutcome = callOutcome;
//         candidate.lastCallDate = date ? new Date(date) : new Date();
//         candidate.startDate = new Date();
//         candidate.endDate = null;
//         candidate.status = "touched",
//             candidate.notes = notes;

//         await candidate.save();

//         await candidate.populate("leadId");

//         res.status(200).json({
//             message: "Lead moved to touched successfully",
//             candidate
//         });
//     } catch (error) {
//         console.error("Error marking lead as touched", error);
//         res.status(500).json({ message: "Error marking lead as touched" });
//     }

// };

exports.markAsTouched = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, callOutcome, duration, time: userTime } = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        // const getISTDate = () => {
        //     const now = new Date();
        //     const istOffset = 5.5 * 60 * 60 * 1000;
        //     return new Date(now.getTime() + istOffset);
        // }

        const istDate = new Date();
        const finalTime = userTime || istDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        candidate.callHistory.push({
            outcome: callOutcome,
            date: istDate,
            time: finalTime,
            duration,
            notes,
            createdAt: istDate,
        });

        candidate.touchedByResume = true;
        candidate.notes = notes;
        candidate.lastCallOutcome = callOutcome;
        candidate.lastCallDate = istDate;
        candidate.startDate = istDate;
        candidate.endDate = null;
        candidate.status = "touched";

        const updated = await candidate.save();

        await clearLeadStateCache();

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


        await clearLeadStateCache();

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

        await clearLeadStateCache();

        res.status(200).json({ message: "Work started successfully", candidate: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error starting work" });
    }
};

exports.movedToMarketing = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Candidate.findByIdAndUpdate(id,
            {
                movedToMarketing: true
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Lead is not found" });

        res.status(200).json({ message: "Lead moved to marketing successfully", candidate: updated });

        await clearLeadStateCache();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error to moved to Marketing" });
    }
};

exports.movedBackToResume = async (req, res) => {
    try {
        console.log("=== BACK TO RESUME HIT ===");
        console.log("ID:", req.params.id);
        const { id } = req.params;
        const { revertReason } = req.body;

        const updated = await Candidate.findByIdAndUpdate(id,
            {
                movedToMarketing: false,
                revertToResume: true,
                movedBackToResume: true,
                endDate: null,
                touchedByResume: false,
                movedToTraining: false,
                revertedAt: new Date(),
                revertReason: String(revertReason).trim(),
                status: "Reverted"
            },
            { new: true }
        ).populate("leadId");

        if (!updated) return res.status(404).json({ message: "Lead is not found" });

        await clearLeadStateCache();

        res.status(200).json({ message: "Lead Moved Back To The Resume Successfully", candidate: updated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error to Moved Back To Resume" });
    }
};

exports.assignToRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.body;
        const { id } = req.params;

        console.log("===Recruiter Assign API HIT====");
        console.log("leadId (req.params):", id);
        console.log("teamMemberId (req.body)", recruiterId);
        console.log("req.user (from token)", req.user);

        if (!recruiterId) {
            return res.status(400).json({ message: "Recruiter ID is required" });
        }

        const updated = await Candidate.findByIdAndUpdate(
            id,
            {
                assignedTo: recruiterId,
                assignedBy: req.user._id,
                assignedAt: new Date(),
                status: "Recruiter"
            },
            { new: true }
        ).populate("assignedTo").populate("assignedBy").populate("leadId");

        if (!updated) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        await clearLeadStateCache();

        res.status(200).json({
            message: "Lead assgined To Recruiter Successfully",
            candidate: updated
        });

    } catch (error) {
        console.error("Assign Recruiter Error:", error);
        res.status(500).json({ message: "Failed To Assign Recruiter" });

    }
};

exports.submitReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = req.body;

        const candidate = await Candidate.findById(id);

        

        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        candidate.reportHistory.push({
            ...report,
            createdAt: new Date()
        })

        await candidate.save();

        res.status(200).json({ message: "Report saved successfully", candidate });

    } catch (error) {
        console.error("Report save error:", error);
        res.status(500).json({ message: "Error saving report" });
    }
};

exports.getReportHistory = async (req, res) => {
    try {

        const { id } = req.params;

        const candidate = await Candidate.findById(id).select("reportHistory");

        if(!candidate) {
            return res.status(404).json({message: "Candidate not found"});
        }

        res.status(200).json(candidate.reportHistory);

    } catch (error) {
        console.error("Get History Error:", error);
        res.status(500).json({ message: "Error fetching report history"});
    }
};

