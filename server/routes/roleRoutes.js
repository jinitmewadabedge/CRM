const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { getRoles, updateRolePermissions } = require('../controllers/roleController');

router.get("/", getRoles);
router.put("/:id", updateRolePermissions)

module.exports = router;
