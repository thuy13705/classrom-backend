// const {db} = require('../../dal/db');
// const { ObjectId, Int32} = require('mongodb');

// exports.list = async () => {
//     const classesCollection = db().collection('classes');
//     const classes = await classesCollection.find().toArray();
//     return classes;
// }

// exports.post = async (filter) => {
//     const classesCollection = db().collection('classes');
//     const result=await classesCollection.insertOne(filter);
//     return result;
// }

// exports.detail = async (id) => {
//     const classesCollection = db().collection('classes');
//     const _class = await classesCollection.findOne({_id: ObjectId(id)});
//       console.log(_class);
//     return _class;
// }

// exports.getAddUser=async(type,id)=>{
//     const classesCollection = db().collection('classes');
//     const result = await  classesCollection.findOneAndUpdate({_id: id}, {$push: { type: req.user.id}}).exec();
//     return result;
//   }
  