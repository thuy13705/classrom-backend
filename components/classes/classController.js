const classService = require('./classService');
const { ObjectId } = require('mongodb');

exports.classes = async (req, res, next) => {
    console.log(req.user);
    console.log(res.locals);
    const classes = await classService.list();
    res.json(classes);
}

exports.postClass = async (req, res) =>{
    
    const filter = {
        name: req.body.name,
        size: req.body.size
    }
    await classService.post(filter);
}