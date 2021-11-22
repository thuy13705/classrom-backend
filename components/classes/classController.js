const classService = require('./classService');
const mongoose = require('mongoose');
const Classes = require('./ClassModel');
const User=require('../users/UserModel')
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

exports.classes = async (req, res, next) => {
  try {
    const response = {}
    const id = new mongoose.Types.ObjectId(req.user.id);
    response.students = await Classes.find({ students: id }).exec();
    response.teachers = await Classes.find({ teachers: id }).exec();
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
  const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        callback(err);
        throw err;

      }
      else {
        callback(null, html);
      }
    });
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email,
      pass: 'wnc123456'
    }
  });

  const curClass = await Classes.findById(req.params.id);
  const curUser=await User.findById(req.user.id);

  readHTMLFile(__dirname + '../../../views/email.hbs', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      nameclass: curClass.nameClass,
      nameuser:curUser.username,
      emailuser:curUser.email,
      link: 'http://127.0.0.1:3000/join/1/'+req.params.id
    };
    var htmlToSend = template(replacements);
    const mailOptions = {
      from: process.env.Email,
      to: req.body.emailTarget,
      subject: 'Invite to class',
      html:htmlToSend
    };
  
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error)
      } else {
        res.json('Email sent: ' + info.response);
      }
    });
  });

  
}

exports.sendMailTeacher = async (req, res) => {
  const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        callback(err);
        throw err;

      }
      else {
        callback(null, html);
      }
    });
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email,
      pass: 'wnc123456'
    }
  });

  const curClass = await Classes.findById(req.params.id);
  const curUser=await User.findById(req.user.id);

  readHTMLFile(__dirname + '../../../views/email.hbs', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      nameclass: curClass.nameClass,
      nameuser:curUser.username,
      emailuser:curUser.email,
      link: 'http://127.0.0.1:3000/join/1/'+req.params.id
    };
    var htmlToSend = template(replacements);
    const mailOptions = {
      from: process.env.Email,
      to: req.body.emailTarget,
      subject: 'Invite to class',
      html:htmlToSend
    };
  
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error)
      } else {
        res.json('Email sent: ' + info.response);
      }
    });
  });

}

