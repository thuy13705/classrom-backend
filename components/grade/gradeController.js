const Grade=require('./gradeModel');
const Classes=require('./../classes/ClassModel')

exports.postAddGrade=async function(req,res){
    try {
        let message="";
        // const isGrade = await Classes.find({
        //     grades:{$elemMatch: {name: req.body.name }}}).exec();

        console.log(isGrade);
        if (isGrade  && isGrade._id===req.params.id){
            message="Exist.";
        }
        else{
            const newGrade = new Grade();
            newGrade.name = req.body.name;
            newGrade.point = req.body.point;
            const result = await newGrade.save();
            if (result){
                const isGrade = await Classes.findOneAndUpdate({_id:req.params.id},{ $push: { grades: result._id }}).exec();
                message="success";
            }
            else{
                const deleGrade=await Grade.findByIdAndDelete({_id:newGrade._id});
                message="fail";
            }
        }
        res.send(message);
      }catch (error) {
        res.status(500).send(error);
      }
}