const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// const todos = [{
//     text: 'First test todo',
//     _id: new ObjectID()
// }, {
//     text: 'Second test todo',
//     _id: new ObjectID()
// }];

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[1]._id;
        var text = 'This is a new task';

        request(app)
        .patch(`/todos/${id}`)
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id;

        request(app)
        .patch(`/todos/${id}`)
        .send({completed: false})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);

    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[1]._id.toHexString());
            expect(res.body.email).toBe(users[1].email);
        })
        .end(done);
    });

    it('should return user 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'email@example.com';
        var password = '123abc!';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            })
        });
    });
    
    it('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({email: 'kjhjhkj', password: 'dfdfsfds'})
        .expect(400)
        .expect((res) => {
            //expect(res.body).toEqual({});
        })
        .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
        .post('/users')
        .send({email: users[0].email, password: users[0].password})
        .expect(400)
        .expect((res) => {
            //expect(res.body).toEqual({});
        })
        .end(done);
    });
});
