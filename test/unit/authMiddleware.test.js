process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../../const');
const { expect } = require('chai');
const db = require('../../src/models');
const bcrypt = require('bcryptjs');
const spies = require('chai-spies');
const chai = require('chai');

chai.use(spies);

const { verifyUserAuthenticated, verifyUserIsAdmin } = require('../../src/routes/authMiddleware');

const req = {
    headers: {},
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

const next = () => {}

describe('Auth Middleware unit tests', () => {
    describe('verifyUserAuthenticated', () => {
        after(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            });
        });

        it('auth middleware should return 401 if authorization or x-access-token headers not set', () => {
            return verifyUserAuthenticated({ ...req, headers: { 
                'authorization': 'randomstring',
                'x-access-token': 'anotherrandomstring',
            } }, res, next)
                .catch((err) => {
                    expect(res.statusCode).to.equal(401)
                });
        });

        it('auth middleware should return 401 if authorization or x-access-token token is invalid', () => {
            return verifyUserAuthenticated({ ...req }, res, next)
                .catch((err) => {
                    expect(res.statusCode).to.equal(401)
                });
        });

        it('auth middleware should return 401 if token headers not correctly verified', async () => {
            const user = await db.User.create({ name: 'John Doe', email: 'abc@mailinator.com', password: bcrypt.hashSync('secret'), isAdmin: true });

            const expiresIn  =  24 * 60 * 60;
            const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }, 
                SECRET_KEY, {
                expiresIn:  expiresIn
            });

            return verifyUserAuthenticated({ 
                        ...req, 
                        headers: { 
                            authorization: 'Bearer ' + accessToken + '3'
                        } 
                    }, 
                    res, 
                    next)
                    .catch((err) => {
                        expect(res.statusCode).to.equal(401);
                    });
        });

        it('expect next to be called if token is verified', async () => {
            const spy = chai.spy(next);
            const user = await db.User.create({ name: 'Jane Doe', email: 'jane@mailinator.com', password: bcrypt.hashSync('secret'), isAdmin: true });

            const expiresIn  =  24 * 60 * 60;
            const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }, 
                SECRET_KEY, {
                expiresIn:  expiresIn
            });

            return verifyUserAuthenticated({ 
                        ...req, 
                        headers: { 
                            authorization: 'Bearer ' + accessToken
                        } 
                    }, 
                    res, 
                    spy)
                    .then(() => {
                        expect(spy).to.have.been.called;
                    });
        });
    });

    describe('verifyUserIsAdmin', () => {
        after(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            });
        });

        it('it should return 401 if user is not admin', () => {
            verifyUserIsAdmin({ ...req, decoded: {isAdmin: false } }, res, next)
            expect(res.statusCode).to.equal(401);
        });

        it('it should call next() if user is admin', () => {
            let mySpy = chai.spy(next);
            verifyUserIsAdmin({ ...req, decoded: { isAdmin: true } }, res, mySpy)
            mySpy.should.have.been.called();
        });
    });
});