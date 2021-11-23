const userService = require('./userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./UserModel');

exports.signup = async (req, res) => {
    var message = "success";
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = hashPass;

    const isUser = await User.findOne({ username: newUser.username });
    const isEmail = await User.findOne({ email: newUser.email });
    if (isUser)
        message = "Tên đăng nhập đã được sử dụng";
    else if (isEmail) {
        message = "Email đã sử dụng";
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
        const isUser = await User.findOne({ _id: req.user.id });
        let checkPassword = await bcrypt.compare(req.body.password, isUser.password);
        if (!checkPassword)
            result = "wrong";
        else {
            const student = await User.findOne({ studentID: req.body.studentID });
            if (student) {
                result = "Exist";
            }
            else {
                const users = await User.findOneAndUpdate({ _id: req.user.id },
                    { studentID: req.body.studentID }, { upsert: true }).exec();
            }
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}



exports.loginGoogle = async (req, res) => {
    const newUser = new User();
    newUser.email = req.body.googleResponse.email;
    
    console.log('email:' + req.body.googleResponse.email);
    const isEmail = await User.findOne({email: req.body.googleResponse.email});
    let curUser;

    if (!isEmail) {
        curUser = await newUser.save();
    }
    else curUser = isEmail;

    res.json({
        user: curUser,
        token: jwt.sign({
            id: curUser._id,
            email: curUser.email
        },
            process.env.JWT_SECRET
        )
    });
}
