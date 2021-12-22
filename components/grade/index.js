const express = require('express');
const router = express.Router();

const gradeController = require('./gradeController');

router.post('/add/:id',gradeController.postAddGrade);
router.post('/delete/:id',gradeController.postDeleteGrade);

router.post('/sort/:id',gradeController.sort);

router.post('/edit/:id',gradeController.edit);

router.post('/pushAllPoint/:id', gradeController.pointAllGrade);

router.post('/sendPoint/:id', gradeController.sendPoint);

router.post('/markFinal/:id', gradeController.markFinal);

module.exports = router;
