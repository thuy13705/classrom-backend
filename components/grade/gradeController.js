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

exports.postDeleteGrade = async function (req, res) {
  try{
  let message = "";
    Classes.findOne({_id: req.params.id}, function(err, classes){
      if(!err){
        Grade.findOneAndDelete({_id: req.body.id}, function(error, grade){
          if(!error){
            Classes.findOneAndUpdate({_id: req.params.id}, {totalGrade: classes.totalGrade - grade.point, 
                                        $pull: {grades: req.body.id}}, {upsert: true}).exec()
          }
        })
        message = "succcess";
      }
      else{
        message = "fail";
      }
    })
    res.send(message);

  }catch(error){
    res.status(500).send(error);
  }
}