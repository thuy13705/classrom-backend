const { ObjectId, Int32} = require('mongodb');
const bcrypt = require('bcrypt');
const User=require('./UserModel');



exports.checkLogin=async (Username, Password)=>
{
    const isUser = await User.findOne({username: Username});

    if (!isUser)
        return false;
    let checkPassword= await bcrypt.compare(Password, isUser.password);
    if (checkPassword && !isUser.isLock) 
    {
        return isUser;
    }
    return false;
}

exports.checkUsername=async (Username)=>
{
    const result = await User.findOne({username: Username});
    return result;
}

exports.checkEmail=async (email)=>
{
    const result = await User.findOne({username: Username});
    return result;
};
