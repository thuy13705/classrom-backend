const passport = require('../../passport');
const express = require('express');
const router = express.Router();

const userController = require('./userController');

router.post('/login',passport.authenticate('local', {session: false}) , userController.login);

router.post('/signup', userController.signup);

module.exports = router;