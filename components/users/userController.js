const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userService = require('./userService');
const passport = require('../../passport');

exports.signup = async (req,res) =>
{
    var messenger = "success";
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        teacher: req.body.teacher
    };

    const isUser  = await userService.checkUser(newUser.username);
    if (isUser)
        messenger = "Tên đăng nhập đã được sử dụng";
    else
        await userService.addUser(newUser);
    res.json(messenger);
}

exports.login = (req,res) => {
    console.log(res.locals);
    console.log(req.user);
    var messenger = "đã đăng nhập";
    if (req.user)
        res.json(messenger);
        else
        {
            passport.authenticate('local', {
            successFlash: console.log(2),
            failureFlash: console.log(1),
            });
        }
}