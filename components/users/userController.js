const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const { json, response } = require('express');
const User=require('./UserModel');

exports.signup = async (req,res) =>
{
    var message = "success";
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const isUser  = await User.findOne({username:newUser.username});
    const isEmail  = await User.findOne({email:newUser.email});
    if (isUser)
        message = "Tên đăng nhập đã được sử dụng";
    else if (isEmail){
        if (!isEmail.username){
            await userService.updateUser(isEmail._id, newUser);
        }
        else
        message = "Email đã sử dụng";
    }
    else 
        await newUser.save();
    res.json(message);
}

exports.login = (req,res) => {
    res.json({
        user : req.user,
        token : jwt.sign({
            id : req.user._id,
            email : req.user.email
        },
        process.env.JWT_SECRET,{expiresIn: '1h'}
        )
    });
}

// exports.logout = async (req,res) => {
//     // if (req.session.user) {
//     //     req.session.user = null;
//     //   }
//     //   req.logout();
//     await jwt.decode(req.headers.authorization);
//     console.log(req.user);
//     res.json("destroy");
// }

exports.getProfile= async (req, res)=>{
  console.log("hihi:");
    const result = await User.findById(req.user.id);
    console.log(result);
    res.json(result);
}

exports.postProfileEdit = async (req, res) => {
  try {
    const response = {};
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      response.message = "Email";
      const result = await User.findOneAndUpdate({ _id: req.user._id },
        { nameUser: req.body.name }, { upsert: true }).exec();
      response.newUser = result;
    }
    else {
      response.message = "Success";
      const result = await User.findOneAndUpdate({ _id: req.user._id },
        { nameUser: req.body.name, email: req.body.email }, { upsert: true }).exec();
        response.newUser = result;
    }
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
  }
exports.loginGoogle = async (req,res) => {
    const newUser = {
        email: req.body.email
    };
    const isEmail  = await userService.checkEmail(newUser.email);
    let curUser;

    if (!isEmail){
        curUser = await userService.addUserEmail(newUser);
    }
    else curUser =  isEmail;

    res.json({
        email : curUser.email,
        token : jwt.sign({
            id : curUser._id,
            email : curUser.email
        },
        process.env.JWT_SECRET,{expiresIn: '1h'}
        )
    });
}
