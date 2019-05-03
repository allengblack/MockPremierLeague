process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../..');
let should = chai.should();
const db = require('../../src/models');

chai.use(chaiHttp);

describe('AuthController E2E tests', () => {
    describe('/POST signup', () => {
        it('it should return 400 if name is not specified', done => {
            chai.request(server)
                .post('/signup')
                .send({ 
                    email: 'abc@mailinator.com', 
                    password: 'secret' 
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should return 400 if email is not specified', done => {
            chai.request(server)
                .post('/signup')
                .send({ 
                    name: 'John Doe',
                    password: 'secret' 
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should return 400 if password is not specified', done => {
            chai.request(server)
                .post('/signup')
                .send({ 
                    name: 'John Doe',
                    email: 'abc@mailinator.com'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should return 201 on successful sign up', done => {
            chai.request(server)
                .post('/signup')
                .send({ 
                    name: 'John Doe',
                    email: 'abc@mailinator.com',
                    password: 'secret' 
                })
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.should.have.status(201);
                    }
                    done();
                });
        });

        it('it should return 400 if user attempts to login with same email twice', done => {
            chai.request(server)
                .post('/signup')
                .send({ 
                    name: 'John Doe',
                    email: 'abc@mailinator.com'
                })
                .end((err, res) => {
                    chai.request(server)
                    .post('/signup')
                    .send({ 
                        name: 'John Doe',
                        email: 'abc@mailinator.com'
                    })
                    .end((err, res) => {
                        if (err) {
                            res.should.have.status(400);
                        }
                    });
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('it should return 400 if email is not specified', done => {
            chai.request(server)
                .post('/login')
                .send({ 
                    password: 'secret' 
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should return 400 if password is not specified', done => {
            chai.request(server)
                .post('/login')
                .send({ 
                    email: 'email@email.com' 
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should return 201 on successful login', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: 'abc@mailinator.com',
                    password: 'secret' 
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should return 404 if user not found', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: 'me@idontexist.com',
                    password: 'secret' 
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should return 400 if password is incorrect', done => {
            chai.request(server)
                .post('/login')
                .set('Content-Type', 'application/json; charset=utf-8')
                .send({
                    email: 'abc@mailinator.com',
                    password: 'secretive' 
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});