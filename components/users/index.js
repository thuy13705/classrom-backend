const passport = require('../../passport');
const express = require('express');
const router = express.Router();

const userController = require('./userController');

router.post('/login',passport.authenticate('local', {session: false}) , userController.login);

router.post('/signup', userController.signup);

router.get('/logout',passport.authenticate('jwt', {session: false}), userController.logout);

router.get('/profile', passport.authenticate('jwt', {session: false}),userController.getProfile);

router.post('/profile',passport.authenticate('jwt', {session: false}), userController.postProfileEdit);

module.exports = router;