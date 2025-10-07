const { default: mongoose } = require('mongoose');
const Lead = require('../models/Lead');
const User = require("../models/User");

exports.createLead = async (req, res) => {

    try {

        const lead = await Lead.create(req.body);
        res.status(201).json(lead);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate("owner", "name email");
        res.status(200).json(leads);

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate("owner", "name email");
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body);
        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
        }
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        res.status(200).json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.activeLeadCount = async (req, res) => {
    try {

        const activeLeadCount = await Lead.countDocuments({});
        res.json({ count: activeLeadCount });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.importLeads = async (req, res) => {
    try {

        console.log("Raw Body:", req.body);
        console.log("Users Fields:", req.body.users);

        const { users } = req.body;

        if (!users || !Array.isArray(users)) {
            console.error("Invalid format, users is:", users);
            return res.status(400).json({ message: "Invalid data format. Expected { users: [...] }", received: req.body });
        }

        const createdUsers = [];

        for (const u of users) {
            console.log("Importing User:", u);
            let role = await Role.findOne({ name: u.role });
            if (!role) {
                console.error("Role is not found:", u.role);
                return res.status(400).json({ message: `Role not found: ${u.role}` });
            }

            const hashedPassword = await bcrypt.hash(u.password, 10);

            const newUser = new User({
                email: u.email,
                password: hashedPassword,
                plainPassword: u.password,
                role: role._id
            });

            await newUser.save();
            createdUsers.push(newUser);
        }

        return res.status(201).json({
            message: "Users imported successfully",
            users: createdUsers
        });
    } catch (err) {
        console.error("Import Error:", err);
        return res.status(500).json({ message: "Server error while importing users", error: err.message });
    }
};
exports.getLeadState = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" })
        }

        const role = req.user.role?.name;
        // console.log("User ID For State:", id);
        console.log("User Role For State:", role);

        const user = req.user;
        console.log("req.user for state:", req.user);
        let total = 0, unassigned = 0, assigned = 0;
        let unassignedLeads = [], assignedLeads = [];

        if (role === "Lead_Gen_Manager") {
            total = await Lead.countDocuments();
            unassignedLeads = await Lead.find({ assignedTo: null })
                .populate("assignedTo assignedBy createdBy departmentId teamId");
            unassigned = unassignedLeads.length;
            assignedLeads = await Lead.find({ assignedTo: { $ne: null } })
                .populate("assignedTo assignedBy createdBy departmentId teamId");
            assigned = assignedLeads.length;

        }

        if (role === "Sales_Manager") {

            total = await Lead.countDocuments();

            unassignedLeads = await Lead.find({
                assignedTo: user._id,
                assignedBy: { $ne: null }
            }).populate("assignedTo assignedBy createdBy departmentId teamId");

            unassigned = unassignedLeads.length;

            assignedLeads = await Lead.find({
                assignedBy: user._id
            }).populate("assignedTo assignedBy createdBy departmentId teamId");
            assigned = assignedLeads.length;
        }

        if (role === "Sales") {
            total = await Lead.countDocuments({ assignedTo: user._id });
            // assigned = await Lead.countDocuments({ assignedTo: user._id });
            assignedLeads = await Lead.find({
                assignedTo: user._id
            }).populate("assignedTo assignedBy createdBy departmentId teamId");
            assigned = assignedLeads.length;
        }

        if (role === "Sr_Lead_Generator") {
            total = await Lead.countDocuments();
        }



        res.status(200).json({ total, unassigned, assigned, unassignedLeads, assignedLeads });

    } catch (error) {
        console.error("Error fetching lead state:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
}

exports.LeadIdOnly = async (req, res) => {
    try {
        const leads = await Lead.find({}, "_id");
        const ids = leads.map((lead) => lead._id.toString());
        res.json(ids);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lead IDs" });
    }
}

exports.getUnassignedLeadIds = async (req, res) => {
    try {
        const unassignedLeads = await Lead.find(
            { status: { $ne: "Assigned" } },
            { _id: 1 }
        );

        const ids = unassignedLeads.map(lead => lead._id);

        return res.status(200).json(ids);
    } catch (error) {
        console.error("Error fetching unassigned leads IDs:", error);
        return res.status(500).json({ message: "Server error fetching unassigned leads" });
    }
};

exports.getAssignedLeadIds = async (req, res) => {
    try {
        const assignedLeads = await Lead.find(
            { status: "Assigned" },
            { _id: 1 }
        );

        const ids = assignedLeads.map(lead => lead._id);

        return res.status(200).json(ids);
    } catch (error) {
        console.error("Error fetching assigned leads IDs:", error);
        return res.status(500).json({ message: "Server error fetching assigned leads" });
    }
};

exports.getAssignedLeads = async (req, res) => {
    console.log("req.user in getAssignedLeads:", req.user);
    try {

        let filter = {}

        if (req.user.role.name === "Lead_Gen_Manager") {
            filter = { assignedTo: { $ne: null } };
        } else if (req.user.role.name === "Sales_Manager") {
            filter = { assignedTo: req.user._id }
        } else if (req.user.role.name === "Sales") {
            filter = { assignedTo: req.user._id }
        }
        else {
            return res.status(403).json({ message: "Access Denied" });
        }

        const leads = await Lead.find(filter)
            .populate("assignedTo", "name email")
            .populate("assignedBy", "name email")
            .populate("createdBy", "name email")
            .populate("departmentId", "name")
            .populate("teamId", "name");

        res.status(200).json(leads);
    } catch (err) {
        console.log("Assigned Error:", err);
        res.status(500).json({ message: "Error fetching assigned leads", error: err });
    }
};


exports.getUnassignedLeads = async (req, res) => {
    try {

        let filter = { assignedTo: null }

        if (req.user.role.name === "Lead_Gen_Manager") {

        } else if (req.user.role.name === "Sales_Manager") {
            filter = { assignedTo: null }
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        const leads = await Lead.find(filter)
            .populate("assignedTo", "name email")
            .populate("assignedBy", "name email")
            .populate("createdBy", "name email")
            .populate("departmentId", "name")
            .populate("teamId", "name")

        res.status(200).json(leads);
    } catch (err) {
        console.log("Unassigned Error:", err);
        res.status(500).json({ message: "Error fetching unassigned leads", error: err })
    }
}

// exports.assignLeads = async (req, res) => {
//     try {

//         const { teamMemberId } = req.body;
//         const { leadId } = req.params;

//         console.log("Assign API Hit");
//         console.log("req.params.leadId:", leadId);
//         console.log("req.body.teamMemberId:", teamMemberId);
//         console.log("req.user in controller:", req.user);

//         if (!mongoose.Types.ObjectId.isValid(leadId) || !mongoose.Types.ObjectId.isValid(teamMemberId)) {
//             return res.status(400).json({ message: "Invalid lead or user ID" });
//         }

//         const managerId = req.user.id;

//         const assignerRole = req.user.role.name;
//         const assignerId = req.user._id;

//         const teamMember = await User.findById(teamMemberId).populate("role", "name");
//         if (!teamMember || !teamMember.role)
//             return res.status(404).json({ message: "Team member or role not found" });

//         console.log("Assigner role:", assignerRole);
//         console.log("Team member role:", teamMember.role.name);
//         console.log("Team member after populate:", teamMember);

//         if (assignerRole === "Lead_Gen_Manager" && teamMember.role.name != "Sales_Manager") {
//             return res.status(403).json({ message: "LGM can assign only to Sales Managers" });
//         }

//         if(assignerRole === "Sales_Manager" && teamMember.role.name != "Sales"){
//             return res.status(403).json({message: "Sales Manager can assign only to Sales team member"});
//         }

//         console.log("managerId to be saved:", managerId);

//         const lead = await Lead.findByIdAndUpdate(
//             leadId,
//             {
//                 assignedTo: teamMemberId,
//                 assignedBy: assignerId,
//                 status: "Assigned",
//                 updatedAt: new Date(),
//             },
//             { new: true }
//         )
//             .populate("assignedTo", "name email")
//             .populate("assignedBy", "name email");

//         if (!lead) {
//             return res.status(404).json({ message: "Lead not found" });
//         }

//         console.log("Updated lead:", lead);
//         res.status(200).json({
//             message: "Lead assigned successfully",
//             lead,
//         });
//     } catch (error) {
//         console.log("Assign Lead Error:", error);
//         res.status(500).json({ message: "Error assigning lead" });
//     }
// };

exports.assignLeads = async (req, res) => {
    try {
        const { teamMemberId } = req.body;
        const { leadId } = req.params;

        console.log("===== ASSIGN API HIT =====");
        console.log("leadId (req.params):", leadId);
        console.log("teamMemberId (req.body):", teamMemberId);
        console.log("req.user (from token):", req.user);

        if (
            !mongoose.Types.ObjectId.isValid(leadId) ||
            !mongoose.Types.ObjectId.isValid(teamMemberId)
        ) {
            return res.status(400).json({ message: "Invalid lead or user ID" });
        }

        const managerId = req.user.id;
        const assignerId = req.user._id;
        const assignerRole = req.user.role.name;

        console.log("managerId (string):", managerId);
        console.log("assignerId (ObjectId):", assignerId);
        console.log("assignerRole:", assignerRole);

        const teamMember = await User.findById(teamMemberId).populate("role", "name");
        console.log("Fetched Team Member:", teamMember);
        console.log("Team Member role:", teamMember?.role?.name);

        if (!teamMember || !teamMember.role) {
            return res.status(404).json({ message: "Team member or role not found" });
        }

        if (assignerRole === "Lead_Gen_Manager" && teamMember.role.name !== "Sales_Manager") {
            return res
                .status(403)
                .json({ message: "LGM can assign only to Sales Managers" });
        }

        if (assignerRole === "Sales_Manager" && teamMember.role.name !== "Sales") {
            return res
                .status(403)
                .json({ message: "Sales Manager can assign only to Sales team member" });
        }

        const lead = await Lead.findByIdAndUpdate(
            leadId,
            {
                assignedTo: teamMemberId,
                assignedBy: assignerId,
                status: "Assigned",
                updatedAt: new Date(),
            },
            { new: true }
        )
            .populate("assignedTo", "name email")
            .populate("assignedBy", "name email");

        console.log("Updated lead after assignment:", lead);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        res.status(200).json({
            message: "Lead assigned successfully",
            lead,
        });
    } catch (error) {
        console.log("Assign Lead Error:", error);
        res.status(500).json({ message: "Error assigning lead", error });
    }
};

exports.bulkAssignLeads = async (req, res) => {
    try {
        const { leadIds, teamMemberId } = req.body;

        console.log("===== BULK ASSIGN API HIT =====");
        console.log("leadIds:", leadIds);
        console.log("teamMemberId:", teamMemberId);
        console.log("req.user (assigner):", req.user);

        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({ message: "leadIds array is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(teamMemberId)) {
            return res.status(400).json({ message: "Invalid team member ID" });
        }
        const assignerRole = req.user.role.name;
        const assignerId = req.user._id;

        const teamMember = await User.findById(teamMemberId).populate("role", "name");
        if (!teamMember || !teamMember.role) {
            return res.status(404).json({ message: "Team member or role not found" });
        }

        if (assignerRole === "Lead_Gen_Manager" && teamMember.role.name !== "Sales_Manager") {
            return res.status(403).json({ message: "LGM can assign only to Sales Managers" });
        }

        if (assignerRole === "Sales_Manager" && teamMember.role.name !== "Sales") {
            return res.status(403).json({ message: "Sales Manager can assign only to Sales team member" });
        }

        const result = await Lead.updateMany(
            { _id: { $in: leadIds } },
            {
                $set: {
                    assignedTo: teamMemberId,
                    assignedBy: assignerId,
                    status: "Assigned",
                    updatedAt: new Date(),
                },
            }
        );
        console.log(`Bulk assigned ${result.modifiedCount} leads successfully`);

        return res.status(200).json({
            message: `${result.modifiedCount} leads assigned successfully.`,
        });
    } catch (error) {
        console.error("Bulk Assign Error:", error);
        res.status(500).json({ message: "Error during bulk asssignment", error });
    }
};

exports.bulkDeleteLeads = async (req, res) => {
    try {
        const { leadIds } = req.body;

        console.log("===== BULK DELETE API HIT =====");
        console.log("leadIds:", leadIds);

        if (!Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({ message: "leadIds array is required" });
        }

        const invalidIds = leadIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: `Invalid lead IDs: ${invalidIds.join(", ")}` });
        }

        const result = await Lead.deleteMany({ _id: { $in: leadIds } });

        console.log(`Deleted ${result.deletedCount} leads successfully`);

        return res.status(200).json({
            message: `${result.deletedCount} leads deleted successfully.`,
        });
    } catch (error) {
        console.error("Bulk Delete Error:", error);
        res.status(500).json({ message: "Error during bulk deletion", error });
    }
};

exports.myleads = async (req, res) => {
    try {

        console.log("REQ.USER:", req.user);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const userId = req.user._id;
        console.log("Sales Manager req.user:", req.user);

        const leads = await Lead.find({ assignedTo: userId })
            .populate("assignedBy", "name email")
            .populate("createdBy", "name email");

        res.status(200).json(leads);

        console.log("My Leads:", leads);
    } catch (err) {
        console.log("Myleads Error:", err);
        res.status(500).json({ message: "Error fetching user leads", error: err })
    }
}

// exports.addCallOutcome = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { outcome, date, time, duration, notes } = req.body;
//         const salesPersonId = req.user._id;

//         const validOutcomes = ["Not Interested", "Interested", "In Discussion", "Follow-up"];

//         if (!validOutcomes.includes(outcome)) {
//             return res.status(400).json({ message: "Invalid outcome value" });
//         }

//         const lead = await Lead.findById(lead);
//         if (!lead) {
//             return res.status(404).json({ message: "Lead not found" });
//         }

//         lead.callHistory.push({
//             outcome,
//             date: date || new Date(),
//             time,
//             duration,
//             notes,
//             salesPerson: salesPersonId
//         });

//         if (outcome === "Interested") {
//             lead.status = "Interested";
//         }
//         else if (outcome === "Not Interested") {
//             lead.status = "Not Interested";
//         }
//         else if (outcome === "In Discussion") {
//             lead.status = "In Discussion";
//         }
//         else if (outcome === "Follow-up") {
//             lead.status = "Connected";
//         }

//         await lead.save();

//         res.status(200).json({ message: "Call outcome added successfully", lead });

//     } catch (error) {
//         console.error("Error in CallOutcome:", error);
//         res.status(500).json({ message: "Server error:", error });
//     }
// };

exports.addCallOutcome = async (req, res) => {

    try {
        const { id } = req.params;
        const { outcome, date, time, duration, notes } = req.body;
        const salesPersonId = req.user._id;

        const validOutcomes = ["Not Interested", "Interested", "In Discussion", "Follow-up"];

        if (!validOutcomes.includes(outcome)) {
            return res.status(400).json({ message: "Invalid outcome value" });
        }

        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        lead.callHistory = lead.callHistory || [];

        lead.callHistory.push({
            outcome,
            date: date || new Date(),
            time,
            duration,
            notes,
            salesPerson: salesPersonId
        });

        switch (outcome) {
            case "Interested":
                lead.status = "Interested";
                break;
            case "Not Interested":
                lead.status = "Not Interested";
                break;
            case "In Discussion":
                lead.status = "In Discussion";
                break;
            case "Follow-up":
                lead.status = "Connected";
                break;
        }

        await lead.save();

        res.status(200).json({ message: "Call outcome added successfully", lead });

    } catch (error) {
        console.error("Error in CallOutcome:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

