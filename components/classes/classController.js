const classService = require('./classService');
const { ObjectId } = require('mongodb');
const Classes=require('./ClassModel');

exports.classes = async (req, res, next) => {
    const classes = await classService.list();
    res.json(classes);
}

exports.postClass = async (req, res) =>{
    
   
    try {
        var classes = new Classes();
        classes.nameCourse = req.body.name;
        classes.category = req.body.category;
        classes.room = req.body.room;
        classes.teachers.push(req.user.id);
        const result = await classes.save();
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
}

exports.detail = async (req, res, next) => {
    var id = req.params.id;
    try {
      const result = await Classes.findOne({_id:id}).populate('teachers').populate('students').exec();
      res.send(result);
    } catch (e) {
      res.status(500).send(e);
    }
}

exports.getLinkInviteTeacher=async function (req, res, next) {
    try {
      const result = await  Course.findOneAndUpdate({_id: req.params.id}, {$push: { teachers: req.user._id}}).exec();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
  exports.getLinkInviteStudent=async function (req, res, next) {
    try {
      const result = await  Course.findOneAndUpdate({_id: req.params.id}, {$push: { students: req.user._id}}).exec();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  