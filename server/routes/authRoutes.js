const express = require('express');
const { login, forgotpassword, activeUserCount, users, addUser, updateUser, deleteUser, resetpassword, importUsers, logout, heartbeat } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.post('/heartbeat', heartbeat);
router.post('/resetpassword', resetpassword);
router.post("/logout", logout);
router.get('/active-user-count', activeUserCount);
router.get('/users', users);
router.post('/users', addUser);             
router.put('/users/:id', updateUser);      
router.delete('/users/:id', deleteUser);
router.post('/users/import', importUsers);

module.exports = router;