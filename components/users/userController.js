
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./UserModel');
const nodemailer = require('nodemailer');

exports.signup = async (req, res) => {
    var message = "success";
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = hashPass;
    newUser.role = "user";
    newUser.isLock = false;
    var d = new Date();
    newUser.date = d.getFullYear().toString() +"-" + (parseInt(d.getMonth())+1).toString() + "-" + d.getDate().toString()+"-" + d.getHours().toString()+"-" + d.getMinutes().toString()+"-"+d.getSeconds().toString();

    const isUser = await User.findOne({ username: newUser.username });
    const isEmail = await User.findOne({ email: newUser.email });
    if (isUser)
        message = "username";
    else if (isEmail) {
        message = "Email";
    }
    else {
        const result = await newUser.save();
    }
    res.json(message);
}

exports.login = (req, res) => {
    res.json({
        user: req.user,
        token: jwt.sign({
            id: req.user._id,
            email: req.user.email
        },
            process.env.JWT_SECRET
        )
    });
}


exports.getProfile = async (req, res) => {
    const result = await User.findById(req.user.id);
    res.json(result);
}

exports.postProfileEdit = async (req, res) => {
    try {
        const result = await User.findOneAndUpdate({ _id: req.user.id },
            { name: req.body.name, gender: req.body.gender }, { upsert: true }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.postChangePassword = async (req, res) => {
    try {
        let result = "succcess"
        const isUser = await User.findOne({ _id: req.user.id });
        let checkPassword = await bcrypt.compare(req.body.password, isUser.password);
        console.log(checkPassword);
        if (!checkPassword)
            result = "wrong";
        else {
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hashSync(req.body.newpass, salt);
            const updateUser = await User.findOneAndUpdate({ _id: req.user.id },
                { password: hashPass }, { upsert: true }).exec();
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.postStudentID = async (req, res) => {
    try {
        let result = "success";
        const student = await User.findOne({ studentID: req.body.studentID });
            if (student) {
                result = "Exist";
            }
            else {
                const users = await User.findOneAndUpdate({ _id: req.user.id },
                    { studentID: req.body.studentID }, { upsert: true }).exec();
            }
        res.json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.lock = async (req, res) => {
        try {
            let result = "success";
            await User.findOneAndUpdate({ _id: req.params.id },
                { isLock: true }, { upsert: true }).exec();
            res.json(result);
        } catch (error) {
            res.status(500).send(error);
        }
}

exports.unlock = async (req, res) => {
        try {
            let result = "success";
            const users = await User.findOneAndUpdate({ _id: req.params.id },
                { isLock: false }, { upsert: true }).exec();
            res.json(result);
        } catch (error) {
            res.status(500).send(error);
        }
}

exports.changeStudentID = async (req, res) =>{
        try {
            
            let result = "success";
            if (req.body.studentID === '' || !await User.findOne({studentID: req.body.studentID}))
                await User.findOneAndUpdate({ _id: req.params.id },
                    { studentID: req.body.studentID }, { upsert: true }).exec();
            else
                result = 'exist';
            res.json(result);
        } catch (error) {
            res.status(500).send(error);
        }
}

exports.getListAccountUser = async(req,res) => {
    const page=req.query.page || 1;
    const perPage = req.query.perPage || 30;
    const sort = req.query.sort || -1;
    const name = req.query.name || "";
    const email = req.query.email || "";
    const result =await User.find({name: { $regex: '.*' + name + '.*' }, email:{ $regex: '.*' + email + '.*' }, role:"user"}).skip(parseInt(perPage)*(parseInt(page)-1)).limit(parseInt(perPage)).sort({'date': parseInt(sort)}).exec();
    const count =await User.count({name: { $regex: '.*' + name + '.*' }, email:{ $regex: '.*' + email + '.*' }, role:"user"});
    res.json({result: result, count:count, perPage: perPage});
}

exports.getListAccountAdmin = async(req,res) => {
    const page=req.query.page || 1;
    const perPage = req.query.perPage || 30;
    const sort = req.query.sort || -1;
    const name = req.query.name || "";
    const email = req.query.email || "";
    const result =await User.find({name: { $regex: '.*' + name + '.*' }, email:{ $regex: '.*' + email + '.*' }, role:"admin"}).skip(parseInt(perPage)*(parseInt(page)-1)).limit(parseInt(perPage)).sort({'date': parseInt(sort)}).exec();

    const count =await User.count({name: { $regex: '.*' + name + '.*' }, email:{ $regex: '.*' + email + '.*' }, role:"admin"});
    res.json({result: result, count:count, perPage: perPage});
}

exports.createAdmin = async(req,res) => {
    var message = "success";
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User();
    newUser.username = req.body.username;
    newUser.password = hashPass;
    newUser.email = req.body.email;
    newUser.role = "admin";
    newUser.isLock = false;
    var d = new Date();
    newUser.date = d.getFullYear().toString() +"-" + (parseInt(d.getMonth())+1).toString() + "-" + d.getDate().toString()+"-" + d.getHours().toString()+"-" + d.getMinutes().toString()+"-"+d.getSeconds().toString();

    const isUser = await User.findOne({ username: newUser.username });
    const isEmail = await User.findOne({ email: newUser.email });
    if (isUser)
        message = "username";
    else if (isEmail) {
        message = "email";
    }
    else {
        const result = await newUser.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.Email,
              pass: 'wnc123456'
            }
          });
            const mailOptions = {
              from: process.env.Email,
              to: req.body.email,
              subject: 'Admin account',
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
                        <p> Your admin account</p>
                        <br>
                        <b><div>username: </div>${req.body.username}</b>
                        <br>
                        <b><div>password: </div>${req.body.password}</b>
                    </div>
                </body>
        
                </html>`
            };
          
          
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json(error)
              } 
            });  
    }
    res.json({message: message});
}

exports.loginGoogle = async (req, res) => {
    const newUser = new User();
    newUser.email = req.body.googleResponse.email;
    newUser.role = "user";
    newUser.isLock = false;

    const isEmail = await User.findOne({email: req.body.googleResponse.email});
    let curUser;

    if (!isEmail) {
        curUser = await newUser.save();
    }
    else curUser = isEmail;

    if (!curUser.isLock)
    res.json({
        user: curUser,
        token: jwt.sign({
            id: curUser._id,
            email: curUser.email
        },
            process.env.JWT_SECRET
        )
    });
    else
    res.json({message: 'fail'});
}

exports.sendMailCode = async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Email,
        pass: 'wnc123456'
      }
    });
  
    const code = randomString(10);
      const mailOptions = {
        from: process.env.Email,
        to: req.query.email,
        subject: 'Activated account',
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
                  <p> Your account confirmation code</p>
                  <br>
                  <b>${code}</b>
              </div>
          </body>
  
          </html>`
      };
    
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json(error)
        } else {
          res.json({code: code});
        }
      });  
  }

  exports.sendMailForgetPasswordCode = async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Email,
        pass: 'wnc123456'
      }
    });

    const _user = await User.findOne({username: req.query.username});
    if (!_user)
        return res.send({code: ''});
    const code = randomString(10);
      const mailOptions = {
        from: process.env.Email,
        to: _user.email,
        subject: 'Forgot password',
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
                  <p> Your account confirmation code</p>
                  <br>
                  <b>${code}</b>
              </div>
          </body>
  
          </html>`
      };
    
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json(error)
        } else {
            res.json({code: code});
        }
      });  
  }
  exports.sendMailNewPassword = async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Email,
        pass: 'wnc123456'
      }
    });

    const user = await User.findOne({username: req.query.username});
    if (!user)
        return res.send({code: ''});
    const code = randomString(10);
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hashSync(code, salt);

    try{
        await User.findOneAndUpdate({ _id: user._id },
            { password: hashPass }, { upsert: true }).exec();
    }   catch(e){
        res.send(e);
    }
    const mailOptions = {
        from: process.env.Email,
        to: user.email,
        subject: 'New password',
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
                  <p> New your password</p>
                  <br>
                  <b>${code}</b>
              </div>
          </body>
  
          </html>`
      };
    
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json(error)
        } else {
            res.json({code: code});
        }
      });  
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