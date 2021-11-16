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

exports.logout = async (req,res) => {
    // if (req.session.user) {
    //     req.session.user = null;
    //   }
    //   req.logout();
    await jwt.decode(req.headers.authorization);
    console.log(req.user);
    res.json("destroy");
}