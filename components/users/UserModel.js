const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const userSchema=new Schema({
    username:{type:String},
    password:{type:String},
    email:{type:String, required:true},
    studentID:{type:String, default:""},
    name:{type:String, default:""},
    gender:{type:String, default:""},
    notifications:[{ type: mongoose.Types.ObjectId, ref: 'Notification' }]
});

module.exports = mongoose.model("User", userSchema)
