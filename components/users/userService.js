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
    if (checkPassword)
    {
        console.log('username: ',user.username);
        return user;
    }
    return false;
}

exports.checkUsername=async (Username)=>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({username: Username});
    if (!user)
        return false;
    return true;
}

exports.checkEmail=async (email)=>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({email: email});
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
            email: newUser.email
        }
        userCollection.insertOne(user);
        });
    })
    return userCollection;
}

exports.getUser= (id) =>{
    const userCollection = db().collection('users');
    return userCollection.findOne({_id: ObjectId(id)});
}