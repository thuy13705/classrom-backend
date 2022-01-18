const mongoose=require('mongoose');
const Schema=mongoose.Schema;


var reviewSchema=new Schema({
    grade:{ type: mongoose.Types.ObjectId, ref: 'Grade' },
    explanation:{type:String,default:""},
    expectation:{type:Number,default:0},
    studentID:{type:String,default:""},
    time:{type:Date,default:Date.now},
    status:{type:Boolean,default:false},
    isDelete:{type:Boolean,default:false},
    comment: [{ type: mongoose.Types.ObjectId, ref: 'Comment'}]
});
module.exports = mongoose.model('Review', reviewSchema);
