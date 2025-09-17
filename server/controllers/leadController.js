const Lead = require('../models/Lead');

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

exports.unassigned = async (req, res) => {

    try {
        const leads = await Lead.find({ assignedTo: null })
            .populate("createdBy", "name email")
            .populate("departmentId", "name")
            .populate("teamId", "name")

        res.status(200).json(leads);
    } catch (err) {
        console.log("Unassigned Error:", err);
        res.status(500).json({ message: "Error fetching unassigned leads", error: err })
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

exports.assign = async (req, res) => {
    try {
        const { teamMemberId } = req.body;
        const { leadId } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const managerId = req.user._id;

        const lead = await Lead.findByIdAndUpdate(
            leadId,
            {
                assignedTo: teamMemberId,
                assignedBy: managerId,
                status: "Assigned",
            },
            { new: true }
        )
            .populate("assignedTo", "name email")
            .populate("assignedBy", "name email");

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        console.log("Lead assigned successfully:", lead);

        res.status(200).json({
            message: "Lead assigned successfully",
            lead,
        });
    } catch (error) {
        console.error("Error assigning lead:", error);
        res.status(500).json({ message: "Error assigning lead", error });
    }
};


exports.myleads = async (req, res) => {
    try {
        const userId = req.user._id;

        const leads = await Lead.find({ assignedTo: userId })
            .populate("assignedBy", "candidate_name candidate_email")
            .populate("createdBy", "candidate_name candidate_email");

        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user leads", error: err })
    }
}