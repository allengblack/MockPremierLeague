// process.env.NODE_ENV = 'test';

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../../index');
// const should = chai.should();
// const db = require('../../src/models');


// chai.use(chaiHttp);

// describe('Fixtures E2E tests', () => {
//     describe('/GET fixture', () => {
//         beforeEach(async () => {
//             const teamOne = await db.Team.create({ name: 'Ballers FC' });
//             const teamTwo = await db.Team.create({ name: 'Faffers FC' });

//             await db.Fixture.create({ homeTeamId: teamTwo.id, awayTeamId: teamOne.id, homeTeamScore: 1, awayTeamScore: 2, matchDate: '2019-04-11T10:03:56.009Z' });
//             await db.Fixture.create({ homeTeamId: teamTwo.id, awayTeamId: teamOne.id, homeTeamScore: 2, awayTeamScore: 1, matchDate: '2019-04-11T10:03:56.009Z' });
//         });

//         afterEach(async () => {
//             await db.Fixture.destroy({ where: {} });
//             await db.Team.destroy({ where: {} });
//         });

//         it('/GET /api/fixtures should get all fixtures', done => {
//             chai.request(server)
//                 .get('/api/fixtures')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(2);
//                 });

//             done();
//         });
//     });
// });