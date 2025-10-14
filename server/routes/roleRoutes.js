const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { getRoles, updateRolePermissions, createRole, deleteRole } = require('../controllers/roleController');

router.get("/", getRoles);
router.put("/:id", updateRolePermissions);
router.post("/add", createRole);
router.delete("/:id", deleteRole);

module.exports = router;
