const mongoose = require("mongoose");
const Role = require("../models/Role"); // <-- apna Role.js ka path yahan sahi dalna

// MongoDB connection
const MONGO_URI = "mongodb://127.0.0.1:27017/bedgetechservices"; // apna DB naam/URI yahan likho

const roles = [
    {
        name: "Admin",
        permissions: {
            lead: {
                createScope: "all",
                readScope: "all",
                updateScope: "all",
                deleteScope: "all",
                assignToSales: true,
                bulkAdd: true,
                export: true
            },
            reports: {
                viewScope: "all",
                simpleView: true,
                manage: true
            }
        }
    },
    {
        name: "Marketing",
        permissions: {
            lead: {
                createScope: "dept",
                readScope: "dept",
                updateScope: "dept",
                deleteScope: "dept",
                assignToSales: false,
                bulkAdd: true,
                export: true
            },
            reports: {
                viewScope: "dept",
                simpleView: true,
                manage: false
            }
        }
    },
    {
        name: "Sales",
        permissions: {
            lead: {
                createScope: "dept",
                readScope: "dept",
                updateScope: "dept",
                deleteScope: "dept",
                assignToSales: true,
                bulkAdd: true,
                export: true
            },
            reports: {
                viewScope: "dept",
                simpleView: true,
                manage: false
            }
        }
    },
    {
        name: "Technical",
        permissions: {
            lead: {
                createScope: "team+dept",
                readScope: "team+dept",
                updateScope: "team+dept",
                deleteScope: "team+dept",
                assignToSales: false,
                bulkAdd: false,
                export: false
            },
            reports: {
                viewScope: "team+dept",
                simpleView: true,
                manage: false
            }
        }
    }
];

async function seedRoles() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");

        for (const role of roles) {
            const existing = await Role.findOne({ name: role.name });
            if (!existing) {
                await Role.create(role);
                console.log(`🌱 Role created: ${role.name}`);
            } else {
                console.log(`⚡ Role already exists: ${role.name}`);
            }
        }

        console.log("✅ Seeding complete");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding roles:", err);
        process.exit(1);
    }
}

seedRoles();
