require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Role = require('../models/Role');

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
                export: true,
            },
            reports: {
                viewScope: "all",
                manage: true,
            }
        }
    },
    {
        name: "Sales",
        permissions: {
            lead: {
                createScope: "own",
                readScope: "team+dept",
                updateScope: "own",
                deleteScope: "own",
                assignToSales: false,
                bulkAdd: true,
                export: true,
            },
            reports: {
                viewScope: "own",
                manage: false,
            }
        }
    },
    {
        name: "Marketing",
        permissions: {
            lead: {
                createScope: "own",
                readScope: "dept",
                updateScope: "own",
                deleteScope: "none",
                assignToSales: false,
                bulkAdd: false,
                export: false,
            },
            reports: {
                viewScope: "dept",
                manage: false,
            }
        }
    },
    {
        name: "Technical",
        permissions: {
            lead: {
                createScope: "none",
                readScope: "dept",
                updateScope: "own",
                deleteScope: "none",
                assignToSales: false,
                bulkAdd: false,
                export: false,
            },
            reports: {
                viewScope: "own",
                manage: false,
            }
        }
    },
    {
        name: "Lead Generator",
        permissions: {
            lead: {
                create: true,
                readScope: "dept",
                updateScope: "own",
                delete: false,
                assignToSales: false,
                bulkAdd: true,
                export: false,
                reportScope: "own",
            },
        },
    },
    {
        name: "Sr. Lead Generator",
        permissions: {
            lead: {
                create: true,
                readScope: "dept",
                updateScope: "dept",
                delete: true,
                assignToSales: true,
                bulkAdd: true,
                export: true,
                reportScope: "dept",
            },
        },
    },
    {
        name: "Lead Gen Team Lead",
        permissions: {
            lead: {
                create: true,
                readScope: "team+dept",
                updateScope: "team+dept",
                delete: true,
                assignToSales: true,
                bulkAdd: true,
                export: true,
                reportScope: "team+dept",
            },
        },
    },
    {
        name: "Lead Gen Manager",
        permissions: {
            lead: {
                create: true,
                readScope: "all",
                updateScope: "all",
                delete: true,
                assignToSales: true,
                bulkAdd: true,
                export: true,
                reportScope: "all",
            },
        },
    },
];

(async function run() {
    try {
        console.log("Loaded MONGO_URL:", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo URL:", process.env.MONGO_URL);
        for (const r of roles) {
            await Role.updateOne({ name: r.name }, r, { upsert: true });
        }
        console.log("✅ Roles seeded/updated");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
