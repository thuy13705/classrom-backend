const mongoose=require('mongoose');
const Schema=mongoose.Schema;


var notiSchema=new Schema({
    grade:{ type: mongoose.Types.ObjectId, ref: 'Grade' },
    description:{type:String, default:""},
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    userRecieve: { type: mongoose.Types.ObjectId, ref: 'User' },
    time:{type:Date,default:Date.now},
    status:{type:Boolean,default:true},
    isDelete:{type:Boolean,default:false}
});
module.exports = mongoose.model('Notification', notiSchema);
