// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({text: 'prepare report'}, {$set: {completed: true}}, {returnOriginal: false}).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({name: 'Valery'}, {$inc: {age: 2}}, {returnOriginal: false}).then((result) => {
        console.log(result);
    })

    // db.close();
});