const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userService = require('./userService');
const jwt = require('jsonwebtoken');

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
        message = "Tên đăng nhập đã được sử dụng";
    else
        await userService.addUser(newUser);
    res.json(message);
}

exports.login = (req,res) => {
    res.json({
        user : req.user,
        token : jwt.sign({
            id : req.user.id,
            username : req.user.username
        },
        process.env.JWT_SECRET,{expiresIn: '1h'}
        )
    });
}