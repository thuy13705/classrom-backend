const User = require('../users/UserModel');
const mongoose = require('mongoose');
const Notification = require('./NotificationModel')

exports.getNotification = async function (req, res) {
  try {
    const id = new mongoose.Types.ObjectId(req.user.id);
    const result = await Notification.find({userRecieve:id,isDelete:false})
    .populate([{ path: 'grade'},{path:'user'},{path:'userRecieve'}])
    .sort({time:-1})
    .exec();
    console.log(result);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}


exports.postNotificaton = async function (req, res) {
  try {
    let message="unsuccess";
    const result = await Notification.findOneAndUpdate({_id:req.params.id},{status:false});
    if (result){
      message="success";
    }
    res.send(message);
  } catch (error) {
    res.status(500).send(error);
  }
}

