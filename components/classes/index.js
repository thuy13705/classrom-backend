const express = require('express');
const router = express.Router();

const classController = require('./classController');

/* GET home page. */
router.get('/', classController.classes);

router.post('/', classController.postClass);

router.get('/:id', classController.detail);

router.post('/sendMailStudent/:id', classController.sendMailStudent);

router.post('/sendMailTeacher/:id', classController.sendMailTeacher);

module.exports = router;
