const classService = require('./classService');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

exports.classes = async (req, res, next) => {
    console.log(req.user);
    const classes = await classService.list();
    res.json(classes);
}

exports.postClass = async (req, res) =>{
    
    const filter = {
        nameClass: req.body.nameClass,
        students: [],
        teachers: [req.user._id],
        category: req.body.category,
        room: req.body.room
    }
    await classService.post(filter);
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    const classes = await classService.detail(id);
    res.json(classes);
}

exports.sendMailStudent = async (req, res) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.Email,
          pass: 'wnc123456'
        }
      });
    console.log(req.body.emailTarget);
    const id = req.params.id;
    const curClass = await classService.detail(id);
      
    const mailOptions = {
        from: process.env.Email,
        to: req.body.emailTarget,
        subject: 'Invite to class',
        text: 'Hello, you have invitation from email ' + req.user.email + ' to invite to class online ' + curClass.nameClass + '. Please click the link http://localhost:3001/classes/join/'+ id +' to join to class online. Thanks for viewing the massage.'
      };
    
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json(error)
        } else {
          res.json('Email sent: ' + info.response);
        }
      });
}

exports.sendMailTeacher = async (req, res) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.Email,
          pass: 'wnc123456'
        }
      });
    console.log(req.body.emailTarget);
    const id = req.params.id;
    const curClass = await classService.detail(id);
      
    const mailOptions = {
        from: process.env.Email,
        to: req.body.emailTarget,
        subject: 'Invite to class',
        text: 'Hello, you have invitation from email ' + req.user.email + ' to invite to class online ' + curClass.nameClass + ' with role as a teacher. Please click the link http://localhost:3001/classes/join/'+ id +' to join to class online. Thanks for viewing the massage.'
      };
    
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json(error)
        } else {
          res.json('Email sent: ' + info.response);
        }
      });
}