const User = require('../users/UserModel');
const mongoose = require('mongoose');
const Review = require('./ReviewModel');
const Grade = require('../grade/gradeModel');
const Notification = require('../notifications/NotificationModel');
const Classes = require('./../classes/ClassModel');
const Comment = require('../review/CommentModel');
const { response } = require('express');

//done
//return 1: giảng viên của lớp
//return 0: sinh viên của lớp
//return -1: nếu không phải.
async function isExist(idGrade, studentID, id) {
  const result = await Grade.findOne({ _id: idGrade }).exec();
  if (result) {
    for (student of result.studentPointList) {
      //Kiểm tra xem có hs đó trong ds điểm ko?
      if (student.studentID === studentID) {
        //tìm user có studentID ở trên.
        const userResult = await User.findOne({ studentID: student.studentID }).exec();
        //nếu tồn tại
        if (userResult) {
          const isClass = await Classes.findOne({ grade: idGrade, students: userResult._id })
          //kiem tra trong lop co sv đó ko?
          if (isClass) {
            const idUser = new mongoose.Types.ObjectId(id);
            const isTeacher = isClass.teachers.indexOf(idUser);
            if (userResult._id == id) {
              return 0
            }

            if (isTeacher > -1) {
              return 1;
            }
          }
        }
      }
    }
    return -1;
  }
}

//return 0: khi không tìm được.
//return về điểm của sv
async function getPointStudent(idGrade, studentID) {
  const result = await Grade.findOne({ _id: idGrade }).exec();
  if (result) {
    for (student of result.studentPointList) {
      //Kiểm tra xem có hs đó trong ds điểm ko?
      if (student.studentID === studentID) {
        return student.point;
      }
    }
    return 0;
  }
}

//done
exports.getGradeReviewer = async function (req, res) {
  try {
    let response = {};
    response.message = "failed";
    const idGrade = req.params.idGrade;
    const studentID = req.params.studentID;
    const id = req.user.id;
    const check = await isExist(idGrade, studentID, id);
    console.log(check);
    if (check == 1 || check == 0) {
      const result = await Grade.findOne({ _id: idGrade }).exec()
      const userResult = await User.findOne({ studentID: studentID }).exec();
      const reviews = await Review.find({ grade: idGrade, studentID: studentID })
      .populate([{path:'grade'},{ 
        path: 'comment',
        populate: {
            path: 'user',
        }
    }])
      .exec();
      console.log(reviews.length);
      response.message = "success";
      response.grade = result;
      response.student = userResult;
      response.point = await getPointStudent(idGrade, studentID);
      if (reviews.length > 0) {
        response.reviews = reviews;
      }
      else {
        response.reviews = [];
      }
    }
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}
//done
exports.getDetailReview = async function (req, res) {
  try {
    let response = {}
    console.log(response);
    const review = await Review.findById(req.params.idReview).populate('grade').exec();
    console.log(review);
    if (review) {
      const check = await isExist(review.grade._id, review.studentID, req.user.id);
      if (check == 1 || check == 0) {
        response = review;
        console.log(response);

      }
    }
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
}

//done
exports.getDetailGradeReview = async function (req, res) {
  try {
    let response = {};
    response.message = "failed";
    const idGrade=req.params.idGrade;
    const isClass = await Classes.findOne({ grades: idGrade }).exec();
    if (isClass) {
      const isTeacher = isClass.teachers.indexOf(req.user.id);
      if (isTeacher > -1) {
        const result = await Grade.findOne({ _id: idGrade }).exec()
        const reviews = await Review.find({ grade: idGrade })
        .populate([{path:'grade'},{ 
          path: 'comment',
          populate: {
              path: 'user',
          }
      }])
        .exec();
        console.log(reviews.length);
        response.message = "success";
        response.grade = result;
        if (reviews.length > 0) {
          response.reviews = reviews;
        }
        else {
          response.reviews = [];
        }
      }
    }
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}

//done
exports.postRequestReview = async function (req, res) {
  try {
    let response = "";
    console.log(req.body.grade);
    const result = await Grade.findOne({ _id: req.body.grade }).exec();
    if (result) {
      for (student of result.studentPointList) {
        if (student.studentID === req.body.studentID) {
          const userResult = await User.findOne({ studentID: student.studentID }).exec();
          console.log(userResult._id + " " + req.user.id)
          if (userResult && userResult._id == req.user.id) {
            const isClass = await Classes.findOne({ grades: req.body.grade }).populate('teachers').exec();
            if (isClass) {
              let model = new Review({
                grade: req.body.grade,
                explanation: req.body.explanation,
                expectation: req.body.expectation,
                studentID: req.body.studentID,
              });
              const review = await model.save();
              if (review) {
                for (teacher of isClass.teachers) {
                  var newNoti = new Notification();
                  newNoti.grade = req.body.grade;
                  newNoti.description = "review grade";
                  newNoti.user = req.user.id;
                  newNoti.userRecieve = teacher._id;
                  await newNoti.save();
                  response = "success"
                }
              }
            }
          }
          else response = "user"
        }
        else response = "student"
      }
    }
    else response = "grade"
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}

//done
exports.postResponseReview = async function (req, res) {
  try {
    let response = "failed";
    const review = await Review.findById(req.params.idReview).populate('grade').populate('comment').exec();
    if (review) {
      const check = await isExist(review.grade._id, review.studentID, req.user.id);
      if (check == 1) {
        const reviewUpdate = await Review.findOneAndUpdate({ _id: req.params.idReview }, { status: true }).populate('grade').exec();
        const idUser = await User.findOne({ studentID: review.studentID });
        var newNoti = new Notification();
        newNoti.grade = review.grade._id;
        newNoti.description = "reply review grade";
        newNoti.user = req.user.id;
        newNoti.userRecieve = idUser;
        await newNoti.save();
        response = "success";
      }
    }
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.postComment = async function (req, res) {
  try {
    let response = "failed"
    const review = await Review.findById(req.params.idReview).populate('grade').exec();
    if (review) {
      const check = await isExist(review.grade._id, review.studentID, req.user.id);
      console.log(check);
      const isClass = await Classes.findOne({ grades: review.grade._id }).populate('teachers').exec();
      let model = new Comment();
      model.user=req.user.id;
      model.message=req.body.message;
      if (check === 1) {
        if (isClass) {
          const comment = await model.save();
          if (comment) {
            const reviewUpdate = await Review.findOneAndUpdate({ _id: req.params.idReview }, { $push: { comment: comment._id } }).populate('grade').exec();
            const isUser = await User.findOne({ studentID: review.studentID }).exec();
            console.log(isUser);
            if (isUser) {
              var newNoti = new Notification();
              newNoti.grade = review.grade._id;
              newNoti.description = "comment review grade";
              newNoti.user = req.user.id;
              newNoti.userRecieve = isUser._id;
              await newNoti.save();
              response = "success"
            }
          }

        
        }
      }
      else if (check === 0) {
        if (isClass) {
          const comment = await model.save();
          if (comment) {
            const reviewUpdate = await Review.findOneAndUpdate({ _id: req.params.idReview }, { $push: { comment: comment._id } }).populate('grade').exec();
            for (teacher of isClass.teachers) {
              var newNoti = new Notification();
              newNoti.grade = review.grade._id;
              newNoti.description = "comment review grade";
              newNoti.user = req.user.id;
              newNoti.userRecieve = teacher._id;
              await newNoti.save();
              response = "success"
            }
          }
        }
      }
    }
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}






