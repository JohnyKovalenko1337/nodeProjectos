const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect= ((callback)=>{
    MongoClient.connect('mongodb+srv://sadJo:123456qwerty@cluster0-am1ix.mongodb.net/test?retryWrites=true&w=majority',
    {useUnifiedTopology: true})
    .then(client => {
        console.log("Success B)");
        _db = client.db();
        callback(client);
    })
    .catch(err =>{
       console.log(err);
    });
});

const getDb = ()=>{
    if(_db){
        return _db;
    }
    else{
        throw "Database does NOT exists";
    }
}

exports.mongoConnect = mongoConnect; 
exports.getDb = getDb;