
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var classSchema=new Schema({
    nameClass:{type:String, default:""},
    students: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    teachers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    category:{type:String, default:""},
    room:{type:String, default:""},
    grades:[{ type: mongoose.Types.ObjectId, ref: 'Grade' }],
    gradeBoard:[],
    totalGrade:{type:Number,default:0},
});
module.exports = mongoose.model('Class', classSchema);
