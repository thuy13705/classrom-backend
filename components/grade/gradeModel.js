const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const gradeSchame=new Schema({
    name:{type:String, require:true},
    point:{type:Number,required:true},
    studentPointList:[],
    isFinal: Boolean
});

module.exports = mongoose.model('Grade', gradeSchame);