const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5a1ed729455760170cd48fb81';

if (!ObjectId.isValid(id)) {
    return console.log("Id not valid");
}
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// })

Todo.findById(id).then((todo) => {
    console.log('Todo', todo);
}).catch((e) => console.log(e));