const express = require('express');
const router = express.Router();

const reviewController = require('./ReviewController');
//done
router.get('/detail/:idGrade/:studentID',reviewController.getGradeReviewer);
//done
router.get('/:idReview',reviewController.getDetailReview);
//done
router.get('/detail/:idGrade',reviewController.getDetailGradeReview);
//done
router.post('/',reviewController.postRequestReview);
//done
router.post('/response/:idReview',reviewController.postResponseReview);
//done
router.post('/comment/:idReview', reviewController.postComment);



module.exports = router;