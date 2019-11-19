const express = require('express');
const UsersController = require('../controllers/users-controller');

const router = express.Router();

router.route('/register').post(UsersController.register);
router.route('/register/:code([a-fA-F0-9]{60})').get(UsersController.confirmRegistration);
router.route('/login').post(UsersController.login);
router.route('/').get(UsersController.getUserData);
router.route('/').post(UsersController.updateUserData);

module.exports = router;