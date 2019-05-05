// process.env.NODE_ENV = 'test';

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../../index');
// const bcrypt = require('bcryptjs');
// const should = chai.should();
// const db = require('../../src/models');
// const SECRET_KEY = require('../../const');
// const jwt = require('jsonwebtoken');
// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('Fixtures E2E tests', () => {
//     before(() => {
//         const user = db.User.create({ name: 'Bugz Bunny', email: 'bugzy@bunny.com', password: bcrypt.hashSync('secret'), isAdmin: true });

//         const expiresIn = 24 * 60 * 60;
//         const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
//             SECRET_KEY, {
//                 expiresIn: expiresIn
//             });
//     });

//     describe('/GET fixture', () => {
//         before(async () => {
//             await db.Fixture.destroy({ where: {} });
//             await db.Team.destroy({ where: {} });

//             const teamOne = await db.Team.create({ name: 'Ballers FC' });
//             const teamTwo = await db.Team.create({ name: 'Faffers FC' });

//             await db.Fixture.create({ homeTeamId: teamTwo.id, awayTeamId: teamOne.id, homeTeamScore: 1, awayTeamScore: 2, matchDate: '2019-04-11T10:03:56.009Z' });
//             await db.Fixture.create({ homeTeamId: teamOne.id, awayTeamId: teamTwo.id, homeTeamScore: 2, awayTeamScore: 1, matchDate: '2019-04-11T10:03:56.009Z' });
//         });

//         after(async () => {
//             await db.Fixture.destroy({ where: {} });
//             await db.Team.destroy({ where: {} });
//         });

//         it('/GET /api/fixtures should get all fixtures', done => {
//             chai.request(server)
//                 .post('/login')
//                 .send({ email: 'bugzy@bunny.com', password: 'secret' })
//                 .end((error, result) => {
//                     console.log({ result: Response.IncomingMessage })
//                 });

//             chai.request(server)
//                 .get('/api/fixtures')
//                 .set('authorization', accessToken)
//                 .type('application/json')
//                 .end((err, res) => {
//                     expect(err).to.be.null;
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(2);
//                 });

//             done();
//         });
//     });
// });