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

        if (role === "Lead_Gen_Manager") {
            total = await Lead.countDocuments();
            unassigned = await Lead.countDocuments({ assignedTo: null });
            assigned = await Lead.countDocuments({ assignedTo: { $ne: null } });
        }

        if (role === "Sr_Lead_Generator") {
            total = await Lead.countDocuments();
        }

        if (role === "Sales_Manager") {
            total = await Lead.countDocuments();
            unassigned = await Lead.countDocuments({ assignedTo: user._id, assignedBy: { $ne: null } });
            assigned = await Lead.countDocuments({ assignedBy: user._id });
        }

        res.status(200).json({ total, unassigned, assigned });

    } catch (error) {
        console.error("Error fetching lead state:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
}

exports.getAssignedLeads = async (req, res) => {
    console.log("req.user in getAssignedLeads:", req.user);
    try {

        let filter = {}

        if (req.user.role.name === "Lead_Gen_Manager") {
            filter = { assignedTo: { $ne: null } };
        } else if (req.user.role.name === "Sales") {
            filter = { assignedBy: req.user._id }
        } else {
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
            filter: { assignedTo: req.user._id }
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

exports.assignLeads = async (req, res) => {
    try {

        const { teamMemberId } = req.body;
        const { leadId } = req.params;

        console.log("Assign API Hit");
        console.log("req.params.leadId:", leadId);
        console.log("req.body.teamMemberId:", teamMemberId);
        console.log("req.user in controller:", req.user);

        if (!mongoose.Types.ObjectId.isValid(leadId) || !mongoose.Types.ObjectId.isValid(teamMemberId)) {
            return res.status(400).json({ message: "Invalid lead or user ID" });
        }

        const managerId = req.user.id;

        const assignerRole = req.user.role.name;
        const assignerId = req.user._id;

        const teamMember = await User.findById(teamMemberId).populate("role", "name");
        if (!teamMember || !teamMember.role)
            return res.status(404).json({ message: "Team member or role not found" });

        console.log("Assigner role:", assignerRole);
        console.log("Team member role:", teamMember.role.name);
        console.log("Team member after populate:", teamMember);

        if (assignerRole === "Lead_Gen_Manager" && teamMember.role.name != "Sales_Manager") {
            return res.status(403).json({ message: "LGM can assign only to Sales Managers" });
        }
        
        if(assignerRole === "Sales_Manager" && teamMember.role.name != "Sales"){
            return res.status(403).json({message: "Sales Manager can assign only to Sales team member"});
        }

        console.log("managerId to be saved:", managerId);

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

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        console.log("Updated lead:", lead);
        res.status(200).json({
            message: "Lead assigned successfully",
            lead,
        });
    } catch (error) {
        console.log("Assign Lead Error:", error);
        res.status(500).json({ message: "Error assigning lead" });
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
    } catch (err) {
        console.log("Myleads Error:", err);
        res.status(500).json({ message: "Error fetching user leads", error: err })
    }
}

// exports.unassigned = async (req, res) => {
//     console.log("Controller Hit!");
//     res.status(200).json({ message: "Success" })
// }

// exports.assign = async (req, res) => {
//     try {
//         const { teamMemberId } = req.body;
//         const { leadId } = req.params;
//         const managerId = req.user ? req.user._id : null;

//         const lead = await Lead.findByIdAndUpdate(
//             leadId,
//             {
//                 assignedTo: teamMemberId,
//                 assignedBy: managerId,
//                 status: "Assigned"
//             },
//             { new: true }
//         )
//             .populate("assignedTo", "name email")
//             .populate("assignedBy", "name email");

//         res.status(200).json({
//             message: "Lead assigend Successfully",
//             lead
//         })
//     } catch (error) {
//         res.status(500).json({ message: "Error assigning lead", error });
//     }
// }

// exports.assign = async (req, res) => {
//     try {
//         const { teamMemberId } = req.body;
//         const { leadId } = req.params;

//         console.log("Assign API Hit");
//         console.log("Lead ID from params:", leadId);
//         console.log("Team Member ID from body:", teamMemberId);

//         // if (!req.user || !req.user._id) {
//         //     return res.status(401).json({ message: "Unauthorized: User not logged in" });
//         // }


//         if (!mongoose.Types.ObjectId.isValid(leadId)) {
//             console.log("One of the IDs is invalid format");
//             return res.status(400).json({ message: "Invalid lead or user ID" });
//         }

//         const leadExists = await Lead.findById(leadId);
//         const userExists = await User.findById(teamMemberId);

//         console.log("Lead Exists?", leadExists ? "Yes" : "No");
//         console.log("User Exists?", leadExists ? "Yes" : "No");

//         if (!leadExists || !userExists) {
//             return res.status(400).json({ message: "Invalid lead or user ID" });
//         }

//         const managerId = req.user ? req.user._id : "68cabb17e9b9afbed6a53f04";

//         const lead = await Lead.findByIdAndUpdate(
//             leadId,
//             {
//                 assignedTo: teamMemberId,
//                 assignedBy: managerId,
//                 status: "Assigned",
//             },
//             { new: true }
//         )
//             .populate("assignedTo", "name email")
//             .populate("assignedBy", "name email");

//         // if (!lead) {
//         //     return res.status(404).json({ message: "Lead not found" });
//         // }

//         console.log("Lead assigned successfully:", lead);

//         res.status(200).json({
//             message: "Lead assigned successfully",
//             lead,
//         });
//     }
//     catch (err) {
//         console.error("Assign Lead Error:", err);
//         res.status(500).json({ message: "Error assigning lead", error: err.message });
//     }

// };