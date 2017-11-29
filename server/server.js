var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/User.js');
var {Todo} = require('./models/Todo.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    
    var newTodo = new Todo({
        text: req.body.text
        });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err)
    })
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

