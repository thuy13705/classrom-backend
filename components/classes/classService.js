const {db} = require('../../dal/db');
const { ObjectId, Int32} = require('mongodb');

exports.list = async () => {
    const classesCollection = db().collection('classes');
    const classes = await classesCollection.find().toArray();
    return classes;
}

exports.post = async (filter) => {
    const classesCollection = db().collection('classes');
    await classesCollection.insertOne(filter);
    return true;
}