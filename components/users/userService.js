const { ObjectId, Int32} = require('mongodb');
const bcrypt = require('bcrypt');
const User=require('./UserModel');



exports.checkLogin=async (Username, Password)=>
{
    const isUser = await User.findOne({username: Username});

    if (!isUser)
        return false;
    let checkPassword= await bcrypt.compare(Password, isUser.password);
    if (checkPassword)
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

// exports.addUser = async (newUser) =>
// {
//     const userCollection = db().collection('users');
//     const saltRounds = 10;
//     await bcrypt.genSalt(saltRounds, function(err, salt){
//         bcrypt.hash(newUser.password, salt , function (err, hash) {
//         const user = {
//             username: newUser.username,
//             password: hash,
//             email: newUser.email
//         }
//         userCollection.insertOne(user);
//         });
//     })
//     return userCollection;
// };

// exports.updateUser = async (id, newUser) =>{
//     const userCollection = db().collection('users');
//     const saltRounds = 10;
//     await bcrypt.genSalt(saltRounds, function(err, salt){
//         bcrypt.hash(newUser.password, salt , function (err, hash) {
//         const user = { $set: {
//             username: newUser.username,
//             password: hash,
//             email: newUser.email
//         }}
//         userCollection.updateOne({_id: id}, user);
//         });
//     })
//     return true;
// };

// exports.addUserEmail = async (newUser) =>
// {
//     const userCollection = db().collection('users');
//     await userCollection.insertOne(newUser);
//     const User = await userCollection.findOne({email: newUser.email});
//     return User;
// };

// exports.getUser= (id) =>{
//     const userCollection = db().collection('users');
//     return await userCollection.findOne({_id: ObjectId(id)});
// }