const express = require('express');
const { signUp, logIn, logout } = require('../controllers/user');
const router = express.Router();

router.route("/user/signUp").post(signUp);
router.route("/user/logIn").post(logIn);
router.route('/user/logout').post(logout)

module.exports = router;