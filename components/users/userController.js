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
    else if (isEmail){
        if (!isEmail.username){
            await userService.updateUser(isEmail._id, newUser);
        }
        else
        message = "Email đã sử dụng";
    }
    else 
        await userService.addUser(newUser);
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