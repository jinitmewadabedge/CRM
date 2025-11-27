const { default: mongoose } = require('mongoose');
const Lead = require('../models/Lead');
const User = require("../models/User");
const Role = require("../models/Role");
const redisClient = require("../utils/redisClient");
const Candidate = require('../models/Candidate');
const { removeListener } = require('../models/CV');
const { invalidLeadStateCache } = require("../utils/cacheHelper");
const { json } = require('express');

exports.createLead = async (req, res) => {

    try {

        const lead = await Lead.create(req.body);
        await invalidLeadStateCache();

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
        await invalidLeadStateCache();
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
        await invalidLeadStateCache();

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

// exports.importLeads = async (req, res) => {
//     try {

//         console.log("Raw Body:", req.body);
//         console.log("Users Fields:", req.body.users);

//         const { leads } = req.body;

//         if (!leads || !Array.isArray(leads)) {
//             console.error("Invalid format, users is:", leads);
//             return res.status(400).json({ message: "Invalid data format. Expected { users: [...] }", received: req.body });
//         }

//         const createdUsers = [];

//         for (const u of leads) {
//             console.log("Importing User:", u);
//             let role = await Role.findOne({ name: u.role });
//             if (!role) {
//                 console.error("Role is not found:", u.role);
//                 return res.status(400).json({ message: `Role not found: ${u.role}` });
//             }

//             const hashedPassword = await bcrypt.hash(u.password, 10);

//             const newUser = new User({
//                 email: u.email,
//                 password: hashedPassword,
//                 plainPassword: u.password,
//                 role: role._id
//             });

//             await newUser.save();
//             createdUsers.push(newUser);
//         }

//         return res.status(201).json({
//             message: "Users imported successfully",
//             users: createdUsers
//         });
//     } catch (err) {
//         console.error("Import Error:", err);
//         return res.status(500).json({ message: "Server error while importing users", error: err.message });
//     }
// };

// exports.importLeads = async (req, res) => {
//     try {
//         console.log("Incoming Lead Data:", req.body);
//         console.log("Lead Fields:", req.body.leads);

//         const { leads } = req.body;

//         if (!leads || !Array.isArray(leads)) {
//             return res.status(400).json({
//                 message: "Invalid format. Expected { leads: [...] }",
//                 received: req.body
//             });
//         }

//         const uniqueLeads = [];

//         for (const lead of leads) {
//             console.log("Importing Lead:", lead);
//             const insertedLeads = await Lead.insertMany(uniqueLeads);
//         }

//         if (uniqueLeads.length === 0) {
//             return res.status(400).json({ message: "All leads already exist in DB" });
//         }

//         console.log(`Inserted ${insertedLeads.length} new leads`);

//         res.status(201).json({
//             message: "Leads imported successfully",
//             count: insertedLeads.length,
//             leads: insertedLeads,
//         });

//     } catch (error) {
//         console.error("Import Leads Error:", error);
//         res.status(500).json({
//             message: "Server error while importing leads",
//             error: error.message,
//         });
//     }
// };


// exports.importLeads = async (req, res) => {
//   try {
//     console.log("📦 Raw Body:", req.body);
//     console.log("🧾 Leads Fields:", req.body.leads);

//     const { leads } = req.body;

//     // Validation
//     if (!leads || !Array.isArray(leads)) {
//       console.error("❌ Invalid format, leads is:", leads);
//       return res.status(400).json({
//         message: "Invalid data format. Expected { leads: [...] }",
//         received: req.body,
//       });
//     }

//     const createdLeads = [];
//     const skippedLeads = [];

//     for (const l of leads) {
//       console.log("➡️ Importing Lead:", l);

//       // Check for existing lead (by email or phone)
//       const existingLead = await Lead.findOne({
//         $or: [
//           { email: l.email?.trim().toLowerCase() },
//           { phone: l["Phone No"] || l.phone },
//         ],
//       });

//       if (existingLead) {
//         console.log(`⚠️ Duplicate found: ${l.email || l["Phone No"]}`);
//         skippedLeads.push(l);
//         continue;
//       }

//       // Create new lead
//       const newLead = new Lead({
//         candidate_name: l.Name || l.name,
//         email: l.email?.trim().toLowerCase(),
//         phone: l["Phone No"] || l.phone,
//         leadType: l["Lead Type"] || l.leadType,
//         url: l.URL || l.url,
//         university: l.University || l.university,
//         technology: l.Technology || l.technology,
//         visa: l.Visa || l.visa,
//         preferredTime: l["Preferred Time"] || l.preferredTime,
//         source: l.Source || l.source,
//         status: l.Status || "New",
//         createdAt: l["Created At"] ? new Date(l["Created At"]) : new Date(),
//         updatedAt: l["Updated At"] ? new Date(l["Updated At"]) : new Date(),
//       });

//       await newLead.save();
//       createdLeads.push(newLead);
//     }

//     // Final Response
//     if (createdLeads.length === 0) {
//       return res.status(400).json({
//         message: "All leads already exist in DB",
//         skippedCount: skippedLeads.length,
//       });
//     }

//     return res.status(201).json({
//       message: "Leads imported successfully",
//       insertedCount: createdLeads.length,
//       skippedCount: skippedLeads.length,
//       createdLeads,
//     });
//   } catch (err) {
//     console.error("🔥 Import Leads Error:", err);
//     return res.status(500).json({
//       message: "Server error while importing leads",
//       error: err.message,
//     });
//   }
// };

exports.importLeads = async (req, res) => {
    try {
        console.log("📦 Raw Body:", req.body);
        const { leads } = req.body;

        if (!leads || !Array.isArray(leads)) {
            return res.status(400).json({ message: "Invalid data format. Expected { leads: [...] }" });
        }

        const createdLeads = [];
        const skippedLeads = [];

        for (const lead of leads) {
            console.log("➡️ Importing Lead:", lead);

            const candidate_email = String(lead.Email).toLowerCase().trim();
            const candidate_phone_no = String(lead["Phone No"]).trim();

            console.log("🔍 Checking duplicates for:", { candidate_email, candidate_phone_no });
            const existingLead = await Lead.findOne({
                $or: [
                    { candidate_email },
                    { candidate_phone_no }
                ]
            });

            if (existingLead) {
                console.log("⚠️ Duplicate found for:", existingLead.candidate_email || existingLead.candidate_phone_no);
                skippedLeads.push(lead);
                continue;
            }

            const parseExcelDate = (value) => {
                if (!value) return new Date();

                if (!isNaN(value)) {
                    const excelEpoch = new Date((value - 25569) * 86400 * 1000);
                    return excelEpoch;
                }

                const parts = value.split("/");
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1;
                    const year = parseInt(parts[2]);
                    return new Date(year, month, day);
                }

                const parsed = new Date(value);
                if (!isNaN(parsed.getTime())) return parsed;

                return new Date();
            };

            const newLead = new Lead({
                type: lead["Lead Type"],
                candidate_name: lead.Name,
                candidate_email,
                candidate_phone_no,
                linked_in_url: lead.URL,
                university: lead.University || "N/A",
                technology: lead.Technology ? lead.Technology.split(",").map(t => t.trim()) : [],
                visa: lead.Visa,
                preferred_time_to_talk: lead["Preferred Time"],
                source: lead.Source || "N/A",
                status: lead.Status || "New",
                createdAt: parseExcelDate(lead["Created At"]),
                updatedAt: parseExcelDate(lead["Updated At"])
            });

            await newLead.save();
            createdLeads.push(newLead);
        }

        return res.status(201).json({
            message: "Leads imported successfully",
            createdCount: createdLeads.length,
            skippedCount: skippedLeads.length,
            createdLeads,
            skippedLeads
        });

    } catch (error) {
        console.error("❌ Import Error:", error);
        return res.status(500).json({
            message: "Server error while importing leads",
            error: error.message
        });
    }
};


// exports.getLeadState = async (req, res) => {
//     try {

//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized: User not found" });
//         }

//         const role = req.user.role?.name;
//         console.log("User Role For State:", role);

//         const user = req.user;
//         console.log("req.user for state:", req.user);
//         const cacheKey = `lead_state:${role}:${user._id}`;

//         const cached = await redisClient.get(cacheKey);
//         if (cached) {
//             console.log("Served from GetLeadState redis cache:", cacheKey);
//             res.setHeader("X-Cache", "HIT");
//             return res.status(200).json(JSON.parse(cached));
//         }

//         console.log("Cache Miss => Computing lead for state:", cacheKey);

//         let total = 0, unassigned = 0, assigned = 0, enrolled = 0, untouched = 0, touched = 0, completed = 0, interested = 0, notInterested = 0, followUp = 0, inDiscussion = 0;
//         let unassignedLeads = [], assignedLeads = [], enrolledLeads = [], untouchedLeads = [], touchedLeads = [], completedLeads = [], interestedLeads = [], notInterestedLeads = [], followUpLeads = [], inDiscussionLeads = [];

//         if (role === "Lead_Gen_Manager") {
//             total = await Lead.countDocuments();
//             unassignedLeads = await Lead.find({ assignedTo: null })
//                 .populate("assignedTo assignedBy createdBy");
//             unassigned = unassignedLeads.length;
//             assignedLeads = await Lead.find({ assignedTo: { $ne: null } })
//                 .populate("assignedTo assignedBy createdBy");
//             assigned = assignedLeads.length;
//         }

//         if (role === "Sales_Manager") {

//             total = await Lead.countDocuments();

//             unassignedLeads = await Lead.find({
//                 assignedTo: user._id,
//                 assignedBy: { $ne: null }
//             }).populate("assignedTo assignedBy createdBy");

//             unassigned = unassignedLeads.length;

//             assignedLeads = await Lead.find({
//                 assignedBy: user._id
//             }).populate("assignedTo assignedBy createdBy");
//             assigned = assignedLeads.length;
//         }

//         if (role === "Sales") {

//             total = await Lead.countDocuments({ assignedTo: user._id });
//             assignedLeads = await Lead.find({
//                 assignedTo: user._id
//             }).populate("assignedTo assignedBy createdBy");
//             assigned = assignedLeads.length;

//             enrolledLeads = await Candidate.find().populate();
//             enrolled = enrolledLeads.length;

//             interestedLeads = await Lead.find({
//                 assignedTo: user._id,
//                 status: "Interested"
//             }).populate("assignedTo assignedBy createdBy");
//             interested = interestedLeads.length;

//             notInterestedLeads = await Lead.find({
//                 assignedTo: user._id,
//                 status: "Not Interested"
//             }).populate("assignedTo assignedBy createdBy");
//             notInterested = notInterestedLeads.length;

//             followUpLeads = await Lead.find({
//                 status: "Follow-up"
//             }).populate("assignedTo assignedBy createdBy");
//             followUp = followUpLeads.length;

//             inDiscussionLeads = await Lead.find({
//                 assignedTo: user._id,
//                 status: "In Discussion"
//             }).populate("assignedTo assignedBy createdBy");
//             inDiscussion = inDiscussionLeads.length;
//         }

//         if (role === "Resume") {

//             total = await Lead.countDocuments();

//             untouchedLeads = await Candidate.find({
//                 movedToTraining: true,
//                 movedToCV: false,
//                 touchedByResume: false
//             }).populate("leadId");
//             untouched = untouchedLeads.length;

//             touchedLeads = await Candidate.find({
//                 movedToTraining: true,
//                 touchedByResume: true,
//                 endDate: null
//             }).populate("leadId");
//             touched = touchedLeads.length;

//             completedLeads = await Candidate.find({
//                 movedToTraining: true,
//                 movedToCV: false,
//                 touchedByResume: true,
//                 endDate: { $ne: null }
//             }).populate("leadId");
//             completed = completedLeads.length;
//         }

//         if (role === "Marketing") {
//             total = await Candidate.countDocuments();

//             unassignedLeads = await Candidate.find({
//                 movedToMarketing: true,
//                 assignedTo: null,
//             }).populate("leadId").populate("assignedTo").populate("assignedBy");
//             unassigned = unassignedLeads.length;

//             assignedLeads = await Candidate.find({
//                 movedToMarketing: true,
//                 assignedTo: { $ne: null }
//             }).populate("leadId").populate("assignedTo").populate("assignedBy");;
//             assigned = assignedLeads.length;
//         }

//         if (role === "Sr_Lead_Generator") {
//             total = await Lead.countDocuments();
//         }

//         const result = ({
//             total, unassigned, assigned, enrolled, untouched, touched, completed, unassignedLeads, assignedLeads, enrolledLeads, untouchedLeads, touchedLeads, completedLeads, interested,
//             notInterested,
//             followUp,
//             inDiscussion,
//             interestedLeads,
//             notInterestedLeads,
//             followUpLeads,
//             inDiscussionLeads
//         });

//         try {
//             await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
//             console.log("Cached lead state:", cacheKey);
//         } catch (error) {
//             console.error("Redis setEx failed:", error);
//         }

//         res.setHeader("X-Cache", "MISS");
//         return res.status(200).json(result);

//     } catch (error) {
//         console.error("Error fetching lead state:", error);
//         res.status(500).json({ message: "Error fetching stats" });
//     }
// }

exports.getLeadState = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const role = req.user.role?.name;
        const userId = req.user._id;

        const cacheKey = `lead_state:${role}:${userId}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log("🔥 Served from Redis:", cacheKey);
            res.setHeader("X-Cache", "HIT");
            return res.status(200).json(JSON.parse(cached));
        }

        console.log("⚠ Cache MISS — Computing:", cacheKey);

        let result = {};

        // ============================================
        // 1️⃣ ROLE : LEAD GEN MANAGER
        // ============================================
        if (role === "Lead_Gen_Manager") {
            const [total, unassignedLeads, assignedLeads] = await Promise.all([
                Lead.countDocuments(),
                Lead.find({ assignedTo: null }).select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),
                Lead.find({ assignedTo: { $ne: null } }).select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),
            ]);

            result = {
                total,
                unassigned: unassignedLeads.length,
                assigned: assignedLeads.length,
                unassignedLeads,
                assignedLeads
            };
        }

        // ============================================
        // 2️⃣ ROLE : SALES MANAGER
        // ============================================
        if (role === "Sales_Manager") {
            const [total, unassignedLeads, assignedLeads] = await Promise.all([
                Lead.countDocuments(),
                Lead.find({
                    assignedTo: userId,
                    assignedBy: { $ne: null }
                }).select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),

                Lead.find({
                    assignedBy: userId
                }).select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),
            ]);

            result = {
                total,
                unassigned: unassignedLeads.length,
                assigned: assignedLeads.length,
                unassignedLeads,
                assignedLeads
            };
        }

        // ============================================
        // 3️⃣ ROLE : SALES
        // ============================================
        if (role === "Sales") {
            const [
                total,
                assignedLeads,
                enrolledLeads,
                interestedLeads,
                notInterestedLeads,
                followUpLeads,
                inDiscussionLeads
            ] = await Promise.all([
                Lead.countDocuments({ assignedTo: userId }),

                Lead.find({ assignedTo: userId })
                    .select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),

                Candidate.find().select("_id"),

                Lead.find({ assignedTo: userId, status: "Interested" })
                    .select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),

                Lead.find({ assignedTo: userId, status: "Not Interested" })
                    .select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),

                Lead.find({ status: "Follow-up" })
                    .select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),

                Lead.find({ assignedTo: userId, status: "In Discussion" })
                    .select("_id assignedTo assignedBy createdBy")
                    .populate("assignedTo assignedBy createdBy"),
            ]);

            result = {
                total,
                assigned: assignedLeads.length,
                enrolled: enrolledLeads.length,
                interested: interestedLeads.length,
                notInterested: notInterestedLeads.length,
                followUp: followUpLeads.length,
                inDiscussion: inDiscussionLeads.length,

                assignedLeads,
                enrolledLeads,
                interestedLeads,
                notInterestedLeads,
                followUpLeads,
                inDiscussionLeads
            };
        }

        // ============================================
        // 4️⃣ ROLE : RESUME TEAM
        // ============================================
        if (role === "Resume") {
            const [total, untouched, touched, completed] = await Promise.all([
                Lead.countDocuments(),

                Candidate.find({
                    movedToTraining: true,
                    movedToCV: false,
                    touchedByResume: false
                }).populate("leadId"),

                Candidate.find({
                    movedToTraining: true,
                    touchedByResume: true,
                    endDate: null
                }).populate("leadId"),

                Candidate.find({
                    movedToTraining: true,
                    movedToCV: false,
                    touchedByResume: true,
                    endDate: { $ne: null }
                }).populate("leadId")
            ]);

            result = {
                total,
                untouched: untouched.length,
                touched: touched.length,
                completed: completed.length,
                untouchedLeads: untouched,
                touchedLeads: touched,
                completedLeads: completed
            };
        }

        // ============================================
        // 5️⃣ ROLE : MARKETING
        // ============================================
        if (role === "Marketing") {
            const [total, unassigned, assigned] = await Promise.all([
                Candidate.countDocuments(),

                Candidate.find({
                    movedToMarketing: true,
                    assignedTo: null,
                }).populate("leadId assignedTo assignedBy"),

                Candidate.find({
                    movedToMarketing: true,
                    assignedTo: { $ne: null },
                }).populate("leadId assignedTo assignedBy")
            ]);

            result = {
                total,
                unassigned: unassigned.length,
                assigned: assigned.length,
                unassignedLeads: unassigned,
                assignedLeads: assigned
            };
        }

        // ============================================
        // 6️⃣ ROLE : Sr Lead Generator
        // ============================================
        if (role === "Sr_Lead_Generator") {
            const total = await Lead.countDocuments();
            result = { total };
        }

        // ============================================
        // Save in Redis
        // ============================================
        await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
        console.log("📌 Cached:", cacheKey);

        res.setHeader("X-Cache", "MISS");
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error getLeadState:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};

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

        const now = new Date();
        const formattedTime =
            time ||
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

        lead.callHistory = lead.callHistory || [];

        lead.callHistory.push({
            outcome,
            date: date || new Date(),
            time: formattedTime,
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
                lead.status = "Follow-up";
                break;
        }

        await lead.save();

        res.status(200).json({ message: "Call outcome added successfully", lead });

    } catch (error) {
        console.error("Error in CallOutcome:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

