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
    res.send(response);
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
    const result = await newClass.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.detail = async (req, res, next) => {
  var id = req.params.id;
  console.log(id);
  try {
    const result = await Classes.findOne({ _id: id }).populate('teachers').populate('students').populate('grades').exec();
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
}

exports.getLinkInviteTeacher = async function (req, res, next) {
  try {
    let result="";
    const id = new mongoose.Types.ObjectId(req.user.id);
    const teachers = await Classes.find({_id:req.params.id,teachers: id }).populate('teachers').populate('students').exec();
    const students = await Classes.find({_id:req.params.id,students: id }).populate('teachers').populate('students').exec();
    if (teachers.length===0 && students.length===0){
      result="success";
      const updateClass = await Classes.findOneAndUpdate({ _id: req.params.id }, { $push: { teachers: req.user.id } }).exec();
    }
    else{
      result="Exist";
    }
    res.send(result);
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
      res.send(result);
    } catch (error) {
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

