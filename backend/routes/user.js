const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkEmail = require('../middleware/check-email');
//const checkPassword = require('../middleware/check-password');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
