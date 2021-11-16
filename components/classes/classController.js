const classService = require('./classService');
const { ObjectId } = require('mongodb');
const userService = require('./../users/userService');

exports.classes = async (req, res, next) => {
    const classes = await classService.list();
    res.json(classes);
}

exports.postClass = async (req, res) =>{
    
    const filter = {
        nameClass: req.body.nameClass,
        students: [],
        teachers: [],
        category: req.body.category,
        room: req.body.room
    }
    const teacher= await userService.getUser(req.user.id)
    filter.teachers.push(teacher);
    const result=await classService.post(filter);
    res.json(result);
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    const classes = await classService.detail(id);
    res.json(classes);
}

exports.getLinkInviteTeacher=async function (req, res, next) {
    const id = req.params.id;
    const result = await classService.detail("teachers",id);
    res.json(result);
  }
  
  exports.getLinkInviteStudent=async function (req, res, next) {
    const id = req.params.id;
    const result = await classService.detail("students",id);
    res.json(result);
  }