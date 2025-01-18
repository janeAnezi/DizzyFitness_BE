const { Login, signUp } = require('../controller/User.js');
const express = require('express');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', Login);

module.exports = router;
