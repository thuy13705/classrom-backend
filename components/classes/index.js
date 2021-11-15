const express = require('express');
const router = express.Router();

const classController = require('./classController');

/* GET home page. */
router.get('/', classController.classes);

router.post('/', classController.postClass);

router.get('/:id', classController.detail);

module.exports = router;
