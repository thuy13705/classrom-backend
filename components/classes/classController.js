const classService = require('./classService');
const { ObjectId } = require('mongodb');

exports.classes = async (req, res, next) => {
    console.log(req.user);
    const classes = await classService.list();
    res.json(classes);
}

exports.postClass = async (req, res) =>{
    
    const filter = {
        nameClass: req.body.nameClass,
        students: [],
        teachers: [],
        category: req.body.category,
        room: req.body.room
    }
    await classService.post(filter);
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    const classes = await classService.detail(id);
    res.json(classes);
}