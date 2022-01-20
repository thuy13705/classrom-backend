const Grade = require('./gradeModel');
const Classes = require('./../classes/ClassModel')
const User = require('../users/UserModel');
const Notification = require('../notifications/NotificationModel');
const mongoose = require('mongoose');

exports.postAddGrade = async function (req, res) {
  try {
    let message = "";

    const newGrade = new Grade();
    newGrade.name = req.body.name;
    newGrade.point = req.body.point;
    const result = await newGrade.save();
    if (result) {
      Classes.findOne({ _id: req.params.id }, function (err, classes) {
        if (!err) {
          classes.totalGrade = classes.totalGrade + result.point;
          classes.grades.push(result._id);
          classes.save();
        }
      });
      message = "success";
    }
    else {
      const deleGrade = await Grade.findByIdAndDelete({ _id: newGrade._id });
      message = "failed";
    }
    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.sort = async (req, res) => {
  try {
    let message = "";
    Classes.findOne({ _id: req.params.id }, function (err, classes) {
      if (!err) {
        classes.grades = [];
        const grades = req.body.grades;
        for (grade of grades)
          classes.grades.push(grade._id);
        classes.save();
        message = "success";
      }
      else
        message = "failed";
    });

    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.edit = async (req, res) => {
  try {
    let message = "";
    const newGrade = new Grade();
    newGrade.name = req.body.name;
    newGrade.point = req.body.point;

    const _grade = await Grade.findOne({ _id: req.body.id });

    const result = await Grade.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name, point: req.body.point }, { upsert: true }).exec();
    if (result) {
      message = "success";
      Classes.findOne({ _id: req.params.id }, function (err, classes) {
        if (!err) {
          Classes.findOneAndUpdate({ _id: req.params.id }, { totalGrade: classes.totalGrade - _grade.point + newGrade.point }, { upsert: true }).exec()
        }
      })
    }
    else {
      message = "failed";
    }
    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}
exports.postDeleteGrade = async function (req, res) {
  try {
    let message = "";
    Classes.findOne({ _id: req.params.id }, function (err, classes) {
      if (!err) {
        Grade.findOneAndDelete({ _id: req.body.id }, function (error, grade) {
          if (!error) {
            Classes.findOneAndUpdate({ _id: req.params.id }, {
              totalGrade: classes.totalGrade - grade.point,
              $pull: { grades: req.body.id }
            }, { upsert: true }).exec()
          }
        })
        message = "succcess";
      }
      else {
        message = "failed";
      }
    })
    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.pointAllGrade = async (req, res) => {
  try {
    let message = "";

    const result = await Grade.findOne({ _id: req.params.id });

    const datas = req.body.datas;

    if (result) {
      for (data of datas) {
        let tmp = true;

        for (point of result.studentPointList)
          if (data.studentID === point.studentID) {
            tmp = false;
            point.point = data.point;
            break;
          }
        if (tmp)
          result.studentPointList.push(data);
      }
      Grade.findOneAndUpdate({ _id: req.params.id }, { studentPointList: result.studentPointList }, { upsert: true }).exec();
    }
    else {
      message = "failed";
    }
    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.sendPoint = async (req, res) => {
  try {
    let message = "";

    const result = await Grade.findOne({ _id: req.params.id });

    const body = req.body;

    if (result) {
      if (result.studentPointList) {
        let tmp = true;
        for (point of result.studentPointList)
          if (body.studentID === point.studentID) {
            tmp = false;
            point.point = body.point;
            break;
          }
        if (tmp)
          result.studentPointList.push({ studentID: body.studentID, point: body.point })
        Grade.findOneAndUpdate({ _id: req.params.id }, { studentPointList: result.studentPointList }, { upsert: true }).exec();
      }
    }
    else {
      message = "failed";
    }
    res.json(message);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.markFinal = async (req, res) => {
  try {
    let message = "";

    const result = await Grade.findOne({ _id: req.params.id });

    if (result) {
      await Grade.findOneAndUpdate({ _id: req.params.id }, { isFinal: true }, { upsert: true }).exec();
      for (student of result.studentPointList) {
        const userResult = await User.findOne({ studentID: student.studentID }).exec();
        const idStudent = new mongoose.Types.ObjectId(userResult._id);
        const idGrade = new mongoose.Types.ObjectId(result._id);
        const isClass = await Classes.find({ students: idStudent, grades: idGrade }).exec();
        console.log(isClass);
        if (isClass.length > 0) {
          var newNoti = new Notification();
          newNoti.grade = result._id;
          newNoti.description = "finished";
          newNoti.user = req.user.id;
          newNoti.userRecieve = userResult._id;
          await newNoti.save();
        }
      }
    }
    else {
      message = "failed";
    }
    res.json(message);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.getCheckGrade = async (req, res) => {
  try {
    let response = "Failed";
    const isGrade = await Grade.findOne({ _id: req.params.id }).exec();
    if (isGrade) {
      const isClass = await Classes.findOne({ grades: isGrade._id }).populate('teachers').populate('students').exec();

      if (isClass) {
        response=isClass;
      }
    }
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}