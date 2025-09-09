const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { getRoles } = require('../controllers/roleController');

// router.get('/', async (req, res) => {
//     try {
//         const roles = await Role.find();
//         res.status(200).json(roles);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.get("/", getRoles);

module.exports = router;
