const userService = require('./userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./UserModel');
const url=require('url');

exports.signup = async (req, res) => {
    var message = "success";
     const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User();
    newUser.username= req.body.username;
    newUser.email= req.body.email;
    newUser.password= hashPass;

    const isUser = await User.findOne({ username: newUser.username });
    const isEmail = await User.findOne({ email: newUser.email });
    if (isUser)
        message = "Tên đăng nhập đã được sử dụng";
    else if (isEmail) {
            message = "Email đã sử dụng";
    }
    else{
        const result=await newUser.save();
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
            process.env.JWT_SECRET, { expiresIn: '1h' }
        )
    });
}


exports.getProfile = async (req, res) => {
    const result = await User.findById(req.user.id);
    res.json(result);
}

exports.postProfileEdit = async (req, res) => {
    try {
        const response = {};
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            response.message = "Email";
            const result = await User.findOneAndUpdate({ _id: req.user.id },
                { name: req.body.name }, { upsert: true }).exec();
            response.newUser = result;
        }
        else {
            response.message = "Success";
            const result = await User.findOneAndUpdate({ _id: req.user.id },
                { name: req.body.name, email: req.body.email }, { upsert: true }).exec();
            response.newUser = result;
        }
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.postChangePassword = async (req, res) => {
    try {
        const result="succcess"
        const isUser = await User.findOne({_id: req.user.id});
        let checkPassword= await bcrypt.compare(Password, isUser.password);
        if (!checkPassword)
            result="wrong";
        else{
                const salt = await bcrypt.genSalt(10);
                const hashPass = await bcrypt.hashSync(req.body.password, salt);
                console.log(hashPass);
                const updateUser = await User.findOneAndUpdate({ _id: req.user.id },
                    { password: hashPass}, { upsert: true }).exec();
            }
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.postStudentID = async (req, res) => {
    try {
        const response = {};
        const emailExist = await User.findOne({ studentID: req.body.studentID });
        if (emailExist) {
            response.message = "Exist";
        }
        else {
            response.message = "Success";
            const result = await User.findOneAndUpdate({ _id: req.user.id },
                { studentID: req.body.studentID }, { upsert: true }).exec();
            response.newUser = result;
        }
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
}



exports.loginGoogle = async (req, res) => {
    const newUser = {
        email: req.body.email
    };
    const isEmail = await userService.checkEmail(newUser.email);
    let curUser;

    if (!isEmail) {
        curUser = await userService.addUserEmail(newUser);
    }
    else curUser = isEmail;

    res.json({
        email: curUser.email,
        token: jwt.sign({
            id: curUser._id,
            email: curUser.email
        },
            process.env.JWT_SECRET
        )
    });
}
