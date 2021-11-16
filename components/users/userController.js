const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const { json } = require('express');

exports.signup = async (req,res) =>
{
    var message = "success";
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const isUser  = await userService.checkUsername(newUser.username);
    const isEmail  = await userService.checkEmail(newUser.email);
    if (isUser)
        message = "Tên đăng nhập đã được sử dụng";
    else if (isEmail)
        message = "Email đã sử dụng";
    else 
        await userService.addUser(newUser);
    res.json(message);
}

exports.login = (req,res) => {
    res.json({
        user : req.user,
        token : jwt.sign({
            id : req.user._id,
            username : req.user.username
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
    const user = await userService.getUser(req.user.id);
    res.json(user);
}

exports.postProfileEdit = async (req, res) => {
    const userCollection = db().collection('users');
    try {
      const response = {};
      const emailExist = await userCollection.findOne({ email: req.body.email });
      if (emailExist) {
        response.message = "Email";
        const result = await userCollection.findOneAndUpdate({ _id: req.user._id },
          { nameUser: req.body.name }, { upsert: true }).exec();
        response.newUser = result;
      }
      else {
        response.message = "Success";
        const result = await userCollection.findOneAndUpdate({ _id: req.user._id },
          { nameUser: req.body.name, email: req.body.email }, { upsert: true }).exec();
          response.newUser = result;
      }
      res.send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  
  }