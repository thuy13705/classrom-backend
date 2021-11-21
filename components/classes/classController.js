const classService = require('./classService');
const mongoose=require('mongoose');
const Classes = require('./ClassModel');

const nodemailer = require('nodemailer');

exports.classes = async (req, res, next) => {
  try {
    const response={}
    const id=new mongoose.Types.ObjectId(req.user.id);
    response.students=await Classes.find({students: id}).exec();
    response.teachers=await Classes.find({teachers: id}).exec();
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
    const result = await Classes.findOne({ _id: id }).populate('teachers').populate('students').exec();
    console.log(result);
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
}

exports.getLinkInviteTeacher = async function (req, res, next) {
  try {
    const result = await Classes.findOneAndUpdate({ _id: req.params.id }, { $push: { teachers: req.user._id } }).exec();
    console.log(result);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getLinkInviteStudent = async function (req, res, next) {
  try {
    const result = await Classes.findOneAndUpdate({ _id: req.params.id }, { $push: { students: req.user.id } }).exec();
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
  const id = req.params.id;
  const curClass = await Classes.findById(id);

  const mailOptions = {
    from: process.env.Email,
    to: req.body.emailTarget,
    subject: 'Invite to class',
    text: 'Hello, you have invitation from email ' + req.user.email + ' to invite to class online ' + curClass.nameClass + '. Please click the linkhttp://127.0.0.1:3000/classes/invite/1/' + id + ' to join to class online. Thanks for viewing the massage.'
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
  console.log(req.body.emailTarget);
  const id = req.params.id;
  const curClass = await Classes.findById(id);

  const mailOptions = {
    from: process.env.Email,
    to: req.body.emailTarget,
    subject: 'Invite to class',
    text: 'Hello, you have invitation from email ' + req.user.email + ' to invite to class online ' + curClass.nameClass + ' with role as a teacher. Please click the link http://127.0.0.1:3000/classes/invite/0/' + id + ' to join to class online. Thanks for viewing the massage.'
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json(error)
    } else {
      res.json('Email sent: ' + info.response);
    }
  });
}

