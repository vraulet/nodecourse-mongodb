// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'To something'}).then((result) => {
    //     console.log(result);
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'To something'}).then((result)=> {
    //     console.log(result);
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // })

    db.collection('Todos').findOneAndDelete({_id : new ObjectID("5a1dd5f83f02f91c6c961630")}).then((result) => {
        console.log(result);
    });

    // db.close();
});