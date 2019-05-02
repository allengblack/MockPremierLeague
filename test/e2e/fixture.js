// process.env.NODE_ENV = 'test';

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../../index');
// let should = chai.should();


// chai.use(chaiHttp);

// describe('Fixtures', () => {
//     beforeEach(done => {
//         done();
//     });

//     describe('/GET fixture', () => {
//         it('it should get all fixtures', done => {
//             chai.request(server)
//                 .get('/api/fixtures')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(0);
//                 });

//             done();
//         });
//     });
// });