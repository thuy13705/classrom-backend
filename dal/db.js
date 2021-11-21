// const { MongoClient } = require("mongodb");

// const uri =
//     "mongodb+srv://bookstore:chi123@cluster0.viplq.mongodb.net/bookstore?retryWrites=true&w=majority";
// // Create a new MongoClient
// const client = new MongoClient(uri, { useUnifiedTopology: true });

// let database;

// async function connectDb(){
//     await client.connect();
//     // Establish and verify connection
//     database = await client.db("Classroom");
//     console.log('Db connected!');
// }

// console.log('RUNNING DB...');

// connectDb();
// const db = () => database;

// module.exports.db = db;
var moogoose=require('mongoose');

const uri='mongodb+srv://thuynguyen:thuy13705@thuynguyen.vpkmh.mongodb.net/ClassRoom?authSource=admin&replicaSet=atlas-zozsyl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

const con=moogoose.connect(uri,(error)=>{
    if (error){
        console.log("Error"+error);
    }else{
        console.log("Connected successfully to server");
    }
});

module.exports=con;