process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { signUp, login } = require('../../src/controllers/authController');
const db = require('../../src/models');
const bcrypt = require('bcryptjs');

const req = {
    body: {}
}

const res = {
    sentData: [],
    statusCode: 0,
    send (...args) {
        this.sentData = args
    },
    status (code) {
        this.statusCode = code
        return this
    }
}

describe('AuthController Unit Tests', () => {
    describe('signup', () => {
        beforeEach(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            })
        });

        afterEach(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            });
        });

        it('should return 201 after succesful sign on', () => {
            signUp({ ...req, body: { name: 'John Doe', email: 'abc@mailinator.com', password: 'secret' } }, res)
            .then(() => {
                expect(res.statusCode).to.equal(201);
            });
        });
    });

    describe('login', () => {
        before(() => {
            db.User.create({ name: 'John Doe', email: 'abc@mailinator.com', password: bcrypt.hashSync('secret'), isAdmin: false });
        });

        after(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            });
        });

        it('should return 200 on successful login', () => {
            return login({ ...req, body: { 
                email: 'abc@mailinator.com', 
                password: 'secret' } 
            }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('should return 400 when password is wrong', () => {
            return login({ ...req, body: { 
                email: 'abc@mailinator.com', 
                password: 'secretivelyfalse' } 
            }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(400);
                });
        });
    });
});