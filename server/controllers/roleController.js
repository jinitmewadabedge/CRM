const Role = require("../models/Role");

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error: err });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400)({ message: "Role name is required" });
        }

        const existingRole = await Role.findOne({ name });

        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }

        const newRole = await Role.create({
            name,
            permissions: {
                lead: {
                    createScope: "own",
                    readScope: "own",
                    updateScope: "own",
                    deleteScope: "none",
                    assignToSales: false,
                    bulkAdd: false,
                    export: false
                },
                reports: {
                    viewScope: "own",
                    simpleView: false,
                    manage: false
                }
            }
        });

        res.status(201).json({
            message: "Role created successfully",
            role: newRole
        });

    } catch (error) {
        res.status(500).json({ message: "Error creating role", error });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRole = await Role.findByIdAndDelete(id);

        if (!deleteRole) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.status(200).json({ message: "Role delete successfuly", role: deleteRole });
    } catch (error) {
        res.status(500).json({ message: "Error deleting role", error });
    }
};

exports.updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { entity, field, value } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { $set: { [`permissions.${entity}.${field}`]: value } },
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: "Error updating role permissions", error });
    }
};