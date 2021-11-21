const passport = require('../../passport');
const express = require('express');
const router = express.Router();

const userController = require('./userController');

router.post('/login',passport.authenticate('local', {session: false}) , userController.login);

router.post('/signup', userController.signup);

router.post('/password', passport.authenticate('jwt', {session: false}),userController.postChangePassword);

router.post('/studentID', passport.authenticate('jwt', {session: false}),userController.postStudentID);

router.get('/profile', passport.authenticate('jwt', {session: false}),userController.getProfile);

router.post('/profile',passport.authenticate('jwt', {session: false}), userController.postProfileEdit);

router.post('/loginGoogle', userController.loginGoogle);


module.exports = router;