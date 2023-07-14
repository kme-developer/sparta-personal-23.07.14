// routes>users.routes.js

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller.js');
const usersController = new UsersController();
// Middleware
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.post('/logout', authMiddleware, usersController.logout);

router.get('/userInfo', authMiddleware, usersController.getUserInfo);
router.put('/userInfo', authMiddleware, usersController.updateUserInfo);
router.delete('/userInfo', authMiddleware, usersController.deleteUserInfo);

module.exports = router;
