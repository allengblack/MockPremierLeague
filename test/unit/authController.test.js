process.env.NODE_ENV = 'test';

const { expect } = require('chai')
const { signUp } = require('../../src/controllers/authController')
const db = require('../../src/models')

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

describe('Auth', () => {
    describe('signup', () => {
        beforeEach(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            })
        })

        it('should return 200', () => {
            signUp({ ...req, body: { name: 'John Doe', email: 'abc@mailinator.com', password: 'secret' } }, res)
            .then(() => {
                expect(res.statusCode).to.equal(200)
            })
        })

        
        afterEach(async () => {
            await db.User.destroy({
                where: {},
                truncate: true
            })
        })
        
    })
})