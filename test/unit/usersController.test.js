process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { getAllUsers, getUserById, deleteUser, updateUser } = require('../../src/controllers/usersController');
const db = require('../../src/models');
const bcrypt = require('bcryptjs');

const req = {
    body: {},
    params: {},
    query: {},
    decoded: {}
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

describe('Users Controller Unit tests', () => {
    describe('getAllUsers', () => {
        after(async () => {
            await db.User.destroy({
                where: {}
            });
        });

        it('should return 200 on successful users list retrieval', () => {
            return getAllUsers(req, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('getUserById', () => {
        after(async () => {
            await db.User.destroy({
                where: {}
            });
        });

        it('it should return 200 if user recovery successful', async () => {
            const user = await db.User.create({ 
                name: 'Person',
                email: 'email@maile.com',
                password: bcrypt.hashSync('secret')
            });

            return getUserById({ ...req, params: { id: user.id }, decoded: { id: user.id }  }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('it should return 404 if user recovery unsuccessful', async () => {
            return getUserById({ ...req, params: { id: 10023 }, decoded: { id: 10023 } }, res)
                .catch(err => {
                    expect(res.statusCode).to.equal(404);
                });
        });
    });

    describe('deleteUser', () => {
        after(async () => {
            await db.User.destroy({
                where: {}
            });
        });

        it('should return 204 on successful user delete', async () => {
            const user = await db.User.create({ 
                name: 'Person',
                email: 'email@maile.com',
                password: bcrypt.hashSync('secret')
            });

            return deleteUser({ ...req, 
                params: { id: user.id } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(204);

                        return getUserById({ ...req, params: { id: user.id } }, res)
                            .catch(() => {
                                expect(res.statusCode).to.equal(404);
                            });
                    });
        });

        it('should return 400 on unsuccessful user delete', async () => {
            return deleteUser({ ...req, 
                params: { id: 56453 } }, res)
                    .catch(() => {
                        expect(res.statusCode).to.equal(400);
                    });
        });
    });

    describe('updateUser', () => {
        afterEach(async () => {
            await db.User.destroy({
                where: {}
            });
        });

        it('should return 204 on successful user update', async () => {
            const user = await db.User.create({ 
                name: 'Person',
                email: 'email@maile.com',
                password: bcrypt.hashSync('secret'),
                isAdmin : true
            });

            return updateUser({ 
                ...req, 
                params: { id: user.id }, 
                body: { name: 'Yahoo Boy' },
                decoded: { isAdmin: true, id: user.id } 
            }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(204);
                });
        });

        it('should return 400 on unsuccessful user update', async () => {
            const user = await db.User.create({ 
                name: 'Person',
                email: 'email@maile.com',
                password: bcrypt.hashSync('secret')
            });

            return updateUser({ 
                    ...req, 
                    params: { id: 12335432 }, 
                    body: { name: 'Yahoo Zaddy' } ,
                    decoded: { isAdmin: true } 
                }, res)
                    .catch((err) => {
                        expect(res.statusCode).to.equal(400);
                    });
        });

        it('should return 401 on unsuccessful user update', async () => {
            const user = await db.User.create({ 
                name: 'Person',
                email: 'email@maile.com',
                password: bcrypt.hashSync('secret')
            });

            return updateUser({ 
                    ...req, 
                    params: { id: user.id }, 
                    body: { name: 'Yahoo Zaddy' } ,
                    decoded: { isAdmin: false, id: 154321 } 
                }, res)
                    .catch((err) => {
                        expect(res.statusCode).to.equal(401);
                    });
        });
    });
});