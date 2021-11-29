const Grade = require('./gradeModel');
const Classes = require('./../classes/ClassModel')

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
          classes.totalGrade=classes.totalGrade+result.point;
          classes.grades.push(result._id);
          classes.save();
        }
      });
      message = "success";
    }
    else {
      const deleGrade = await Grade.findByIdAndDelete({ _id: newGrade._id });
      message = "fail";
    }
    res.send(message);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.sort = async (req, res) =>{
  try {
    let message = "";
    console.log(req.body);
    
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
        message = "fail";
    });

    res.send(message);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.edit = async (req, res) =>{
  try {
    let message = "";

    console.log(req.body);

    const newGrade = new Grade();
    newGrade.name = req.body.name;
    newGrade.point = req.body.point;

    const result = await Grade.findOneAndUpdate({_id: req.body.id}, {name: req.body.name, point: req.body.point}, { upsert: true }).exec();
    if (result) {
      message = "success";
    }
    else {
      message = "fail";
    }
    res.send(message);
  } catch (error) {
    res.status(500).send(error);
  }
}