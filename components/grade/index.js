const express = require('express');
const router = express.Router();

const gradeController = require('./gradeController');

router.post('/add/:id',gradeController.postAddGrade);

module.exports = router;
