const mongoose=require('mongoose');
const Schema=mongoose.Schema;


var commentSchema=new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    message:{type:String,default:""},
    time:{type:Date,default:Date.now},
    status:{type:Boolean,default:false},
    isDelete:{type:Boolean,default:false},
});
module.exports = mongoose.model('Comment', commentSchema);
