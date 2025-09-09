const express = require('express');
const { login, forgotpassword, activeUserCount, users, addUser, updateUser, deleteUser, resetpassword, importUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword', resetpassword)
router.get('/active-user-count', activeUserCount);
router.get('/users', users);
router.post('/users', addUser);             
router.put('/users/:id', updateUser);      
router.delete('/users/:id', deleteUser);
router.post('/users/import', importUsers);

module.exports = router;