const Role = require("../models/Role");

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error: err });
    }
};

exports.updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params; 
        const { permissions } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { permissions },
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