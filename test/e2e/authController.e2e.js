process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../..');
let should = chai.should();
const db = require('../../src/models')

const req = {
    body: {}
}

chai.use(chaiHttp);

describe('Auth', () => {

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

        it('it should return 200', done => {
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
                        res.should.have.status(200);
                    }
                    done();
                });
        });
    });
});