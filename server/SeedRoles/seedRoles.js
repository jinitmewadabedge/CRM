const mongoose = require("mongoose");
// const Role = require("./models/Role");
const Role = require("../models/Role");

const roles = [
    {
        name: "Lead_Generator",
        permissions: {
            lead: {
                createScope: "own",
                readScope: "dept",
                updateScope: "own",
                deleteScope: "none",
                assignToSales: false,
                bulkAdd: true,
                export: false,
            },
            reports: {
                viewScope: "own",
                simpleView: true,   // 👈 only for LG
                manage: false,
            },
        },
    },
    {
        name: "Sr_Lead_Generator",
        permissions: {
            lead: {
                createScope: "dept",
                readScope: "dept",
                updateScope: "dept",
                deleteScope: "dept",
                assignToSales: true,
                bulkAdd: true,
                export: true,
            },
            reports: {
                viewScope: "dept",
                simpleView: false,
                manage: true,
            },
        },
    },
    {
        name: "Lead_Gen_Team_Lead",
        permissions: {
            lead: {
                createScope: "team+dept",
                readScope: "team+dept",
                updateScope: "team+dept",
                deleteScope: "team+dept",
                assignToSales: true,
                bulkAdd: true,
                export: true,
            },
            reports: {
                viewScope: "team+dept",
                simpleView: false,
                manage: true,
            },
        },
    },
    {
        name: "Lead_Gen_Manager",
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
                simpleView: false,
                manage: true,
            },
        },
    },
];

async function seed() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bedgetechservices");
        await Role.deleteMany({});
        await Role.insertMany(roles);
        console.log("Roles seeded successfully!");
        mongoose.disconnect();
    } catch (err) {
        console.error("Error seeding roles:", err);
    }
}

seed();
