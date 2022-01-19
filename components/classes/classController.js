const mongoose = require('mongoose');
const Classes = require('./ClassModel');
const User=require('../users/UserModel')
const nodemailer = require('nodemailer');

exports.classes = async (req, res, next) => {
  try {
    const response = {}
    const id = new mongoose.Types.ObjectId(req.user.id);
    response.students = await Classes.find({ students: id }).populate('students').populate('teachers').exec();
    response.teachers = await Classes.find({ teachers: id }).populate('teachers').populate('students').exec();
    res.json(response);
  } catch (e) {
    res.status(500).send(error);
  }
}

exports.postClass = async (req, res) => {
  try {
    var newClass = new Classes();
    newClass.nameClass = req.body.name;
    newClass.category = req.body.category;
    newClass.room = req.body.room;
    newClass.teachers.push(req.user.id);
    let code = randomString(6);
    while (await Classes.findOne({code: code})){
      code = randomString(6);
    }
    newClass.code = code;
    var d = new Date();
    newClass.date = d.getFullYear().toString() +"-" + (parseInt(d.getMonth())+1).toString() + "-" + d.getDate().toString()+"-" + d.getHours().toString()+"-" + d.getMinutes().toString()+"-"+d.getSeconds().toString();

    const result = await newClass.save();
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.detail = async (req, res, next) => {
  var id = req.params.id;
  const user = await User.findOne({_id : req.user.id});
  try {
    const result = await Classes.findOne({ _id: id }).populate('teachers').populate('students').populate('grades').exec();
    if (result){
      for (grade of result.gradeBoard){
        grade.point = [];
        if (user && user.studentID === grade.studentID)
          grade.isOwner = true;
        if (result.grades.length > 0)
        for (_grade of result.grades)
        {
          let tmp = true;
          if (_grade.studentPointList.length > 0)
          for (point of _grade.studentPointList){
            if (point.studentID === grade.studentID)
              {
                tmp = false;
                grade.point.push({grade: _grade, point: point.point});
                break;
              }
          }
          if (tmp)
            grade.point.push({grade: _grade, point: 0});
        }
      }
    }
    res.json(result);
  } catch (e) {
    res.status(500).send(e);
  }
}

exports.getLinkInviteTeacher = async function (req, res, next) {
  try {
    let result="";
    const id = new mongoose.Types.ObjectId(req.user.id);
    const teachers = await Classes.find({_id:req.params.id, teachers: id }).populate('teachers').populate('students').exec();
    const students = await Classes.find({_id:req.params.id, students: id }).populate('teachers').populate('students').exec();
    if (teachers.length===0 && students.length===0){
      result="success";
      const updateClass = await Classes.findOneAndUpdate({ _id: req.params.id }, { $push: { teachers: req.user.id } }).exec();
    }
    else{
      result="Exist";
    }
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getLinkInviteStudent = async function (req, res, next) {
    try {
      let result="";
      const id = new mongoose.Types.ObjectId(req.user.id);
      const teachers = await Classes.find({_id:req.params.id,teachers: id }).populate('teachers').populate('students').exec();
      const students = await Classes.find({_id:req.params.id,students: id }).populate('teachers').populate('students').exec();
      if (teachers.length===0 && students.length===0){
        result="success";
        const updateClass = await Classes.findOneAndUpdate({ _id: req.params.id }, { $push: { students: req.user.id } }).exec();
      }
      else{
        result="Exist";
      }
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
}

exports.inviteByCode = async (req, res, next) => {
  try {
    let result="";
    const id = new mongoose.Types.ObjectId(req.user.id);
    if (!await Classes.findOne({code: req.params.id}))
      return res.send({result: result});
    const teachers = await Classes.find({code:req.params.id,teachers: id }).populate('teachers').populate('students').exec();
    const students = await Classes.find({code:req.params.id,students: id }).populate('teachers').populate('students').exec();
    if (teachers.length===0 && students.length===0){
      result="success";
      await Classes.findOneAndUpdate({ code: req.params.id }, { $push: { students: req.user.id } }).exec();
    }
    else{
      result="Exist";
    }
    res.json({result: result});
  } catch (error) {
    res.status(500).send({error: error});
  }
}

exports.getAllClass = async (req, res) => {
  try {
    const page=req.query.page || 1;
    const perPage = req.query.perPage || 30;
    const sort = req.query.sort || -1;
    const name = req.query.name || "";
    const result =await Classes.find({nameClass: { $regex: '.*' + name + '.*' }}).skip(parseInt(perPage)*(parseInt(page)-1)).limit(parseInt(perPage)).sort({'date': parseInt(sort)}).exec();
    const count =await Classes.count({nameClass: { $regex: '.*' + name + '.*' }});
    res.json({result: result, count: count, perPage: perPage});
  } catch (e) {
    res.status(500).send(error);
  }
}


exports.sendMailStudent = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email,
      pass: 'wnc123456'
    }
  });

  const curClass = await Classes.findById(req.params.id);
  const curUser=await User.findById(req.user.id);
  console.log(curClass);
  console.log(curUser);

  const link='https://classrom-fe-midterm.herokuapp.com/invite/1/'+req.params.id
    const mailOptions = {
      from: process.env.Email,
      to: req.body.emailTarget,
      subject: 'Invite to class',
      html:`
      <!DOCTYPE html>
        <html>

        <head>
            <style type="text/css">
            
            </style>
        </head>

        <body>
            <div>
                <p>Hi!</p>
                <p>${curUser.name} (${curUser.email}) invite you join in <b>${curClass.nameClass}</b></p>
                <br>
                <button style="padding: 10px 20px;background-color: blue; border-radius:5px; border:none"><a
                        style=" color:white" href="${link}">Join</a></button>
            </div>
        </body>

        </html>`
    };
  
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error)
      } else {
        res.json('Email sent: ' + info.response);
      }
    });  
}

exports.sendMailTeacher = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email,
      pass: 'wnc123456'
    }
  });

  const curClass = await Classes.findById(req.params.id);
  const curUser=await User.findById(req.user.id);

  const link='https://classrom-fe-midterm.herokuapp.com/invite/0/'+req.params.id
    const mailOptions = {
      from: process.env.Email,
      to: req.body.emailTarget,
      subject: 'Invite to class',
      html:`
      <!DOCTYPE html>
        <html>

        <head>
            <style type="text/css">
            
            </style>
        </head>

        <body>
            <div>
                <p>Hi!</p>
                <p>${curUser.name} (${curUser.email}) invite you join in <b>${curClass.nameClass}</b></p>
                <br>
                <button style="padding: 10px 20px;background-color: blue; border-radius:5px; border:none"><a
                        style=" color:white" href="${link}">Join</a></button>
            </div>
        </body>

        </html>`
    };
  
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error)
      } else {
        res.json('Email sent: ' + info.response);
      }
    });  
}

exports.gradeBoard = async (req, res) =>{
  const id = req.params.id;
  try {
    const result = await Classes.findOne({ _id: id }).exec();
    const datas = req.body.datas;
    for (data of datas)
    {
      let tmp = true;
      for (board of result.gradeBoard)
        if (board.studentID === data.studentID)
        {
          tmp = false;
          break;
        }
      if (tmp)
        result.gradeBoard.push(data);
    }
    Classes.findOneAndUpdate({_id: req.params.id}, {gradeBoard: result.gradeBoard}, {upsert: true}).exec()
    res.json(result);
  } catch (e) {
    res.status(500).send(e);
  }
}

function randomString(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.checkRole = async (req, res, next) => {
  try {
    let response = "not";
    const id = new mongoose.Types.ObjectId(req.user.id);
    const students= await Classes.findOne({_id:req.params.id,students:id}).exec();
    const teachers = await Classes.findOne({_id:req.params.id,teachers:id}).exec();
    if (students){
      response="student";
    }
    if (teachers){
      response="teacher";
    }
    res.json(response);
  } catch (e) {
    res.status(500).send(error);
  }
}