const {db} = require('../../dal/db');
const { ObjectId, Int32} = require('mongodb');
const bcrypt = require('bcrypt');


exports.checkLogin=async (Username, Password)=>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({username: Username});
    if (!user)
        return false;
    let checkPassword= await bcrypt.compare(Password, user.password);
    if (checkPassword && (String(user.status)=="active"))
    {
        console.log('username: ',user.username);
        return user;
    }
    return false;
}

exports.checkUser=async (Username)=>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({username: Username});
    if (!user)
        return false;
    return true;
}

exports.addUser = async (newUser) =>
{
    const userCollection = db().collection('users');
    const saltRounds = 10;
    await bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(newUser.password, salt , function (err, hash) {
        const user = {
            username: newUser.username,
            password: hash,
            email: newUser.email,
            status: 'active',
            teacher: newUser.teacher
        }
        userCollection.insertOne(user);
        });
    })
    return userCollection;
}