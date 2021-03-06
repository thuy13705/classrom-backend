const express = require('express');
const router = express.Router();

const classController = require('./classController');

/* GET home page. */
router.get('/', classController.classes);

router.post('/', classController.postClass);

router.get('/getAllClass', classController.getAllClass);

router.get('/:id', classController.detail);

router.get('/invite/1/:id', classController.getLinkInviteStudent);

router.get('/invite/0/:id', classController.getLinkInviteTeacher);

router.post('/sendMailStudent/:id', classController.sendMailStudent);

router.post('/sendMailTeacher/:id', classController.sendMailTeacher);

router.post('/gradeBoard/:id', classController.gradeBoard);

router.get('/inviteByCode/:id', classController.inviteByCode);

router.get('/check/:id', classController.checkRole);

module.exports = router;
