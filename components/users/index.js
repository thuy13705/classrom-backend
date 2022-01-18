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

router.get('/listAccountUser', passport.authenticate('jwt', {session: false}), userController.getListAccountUser);

router.get('/listAccountAdmin', passport.authenticate('jwt', {session: false}), userController.getListAccountAdmin);

router.post('/createAdmin', passport.authenticate('jwt', {session: false}), userController.createAdmin);

router.get('/sendMailCodeAccount', userController.sendMailCode);

router.get('/sendMailCodeForgetPassword', userController.sendMailForgetPasswordCode);

router.get('/lock/:id', passport.authenticate('jwt', {session: false}), userController.lock);

router.get('/unlock/:id', passport.authenticate('jwt', {session: false}), userController.unlock);

router.post('/changeStudentID/:id', passport.authenticate('jwt', {session: false}), userController.changeStudentID);

router.get('/sendMailNewPassword', userController.sendMailNewPassword);

router.post('/loginGoogle', userController.loginGoogle);


module.exports = router;