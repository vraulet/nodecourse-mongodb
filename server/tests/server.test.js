const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo'
  }];
// const todos = [{
//     text: 'First test todo',
//     _id: new ObjectID()
// }, {
//     text: 'Second test todo',
//     _id: new ObjectID()
// }];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('It should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    })
})

describe('GET /todos', () => {
    it('should get all the todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('Get /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/HelloWorld`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete the todo by id', (done) => {
        var id = todos[0]._id;

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(id).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch(e => done(e));
        });
    })

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object is invalid', (done) => {
        request(app)
        .delete('/todos/Tomatoes')
        .expect(404)
        .end(done);
    });
});