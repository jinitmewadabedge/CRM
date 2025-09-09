const express = require('express');
const { protect, authorizedRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorizedRoles('Admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' });
})

router.get('/sales', protect, authorizedRoles('Sales'), (req, res) => {
    res.json({ message: 'Welcome Sales' });
})

router.get('/marketing', protect, authorizedRoles('Marketing'), (req, res) => {
    res.json({ message: 'Welcome Marketing' });
})

router.get('/technical', protect, authorizedRoles('Technical'), (res, req) => {
    res.json({ message: 'Welcome Marketing' });
})

router.get('/public', (req, res) => {
    res.json({ message: 'Welcome to Public Route' });
});

module.exports = router;
