const express = require('express');
const router = express.Router();

const classController = require('./classController');

/* GET home page. */
router.get('/', classController.classes);

router.post('/', classController.postClass);

router.get('/:id', classController.detail);

router.get('invite/1/:id', classController.getLinkInviteStudent);

router.get('invite/0/:id', classController.getLinkInviteTeacher);

module.exports = router;
