process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { createFixture, getAllFixtures, getFixtureById, updateFixture, deleteFixture, searchFixtures } = require('../../src/controllers/fixturesControllers');
const db = require('../../src/models');

const req = {
    body: {},
    params: {},
    query: {}
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

describe('FixtureController Unit Tests', () => {
    describe('create', () => {
        after(async () => {
            await db.Fixture.destroy({
                where: {}
            });

            await db.Team.destroy({
                where: {}
            });
        });

        it('it should return 201 after successful fixture creation', async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            return createFixture({ ...req, 
                body: { 
                    homeTeamId: team1.id, 
                    awayTeamId : team2.id, 
                    homeTeamScore: 0, 
                    awayTeamScore : 2, 
                    matchDate: new Date() 
                } 
            }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(201);
                });
        });

        it('it should return 400 if user adds team that doesn\'t exist', async () => {
            return createFixture({ ...req, 
                body: { 
                    homeTeamId: 123,
                    awayTeamId : 10, 
                    homeTeamScore: null, 
                    awayTeamScore : null, 
                    matchDate: new Date() 
                } 
            }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(400);
                })
        });
    });

    describe('getAllFixtures', () => {
        before(async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            const fixture = db.Fixture.create({ homeTeamId: team1.id, awayTeamId: team2.id, homeTeamScore: 0, awayTeamScore: 1, matchDate: new Date(), pending: false});
        });

        after(async () => {
            await db.Fixture.destroy({
                where: {}
            });

            await db.Team.destroy({
                where: {}
            });
        });

        it('it should return 200 if fixture recovery successful', async () => {
            before(async () => {
                getAllFixtures({ ...req, body: { } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(200);
                    });
            });

            return getAllFixtures({ ...req, body: { } }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('getFixtureById', () => {
        before(async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            await db.Fixture.create({ homeTeamId: team1.id, awayTeamId: team2.id, homeTeamScore: 0, awayTeamScore: 1, matchDate: new Date(), pending: false });
        });

        after(async () => {
            await db.Fixture.destroy({
                where: {}
            });

            await db.Team.destroy({
                where: {}
            });
        });

        it('it should return 200 if fixture recovery successful', async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            const fixture = await db.Fixture.create({ homeTeamId: team1.id, awayTeamId: team2.id, homeTeamScore: 0, awayTeamScore: 1, matchDate: new Date(), pending: false});

            return getFixtureById({ ...req, params: { id: fixture.id } }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('it should return 404 if fixture recovery unsuccessful', async () => {
            return getFixtureById({ ...req, params: { id: 10023 } }, res)
                .catch(err => {
                    expect(res.statusCode).to.equal(404);
                });
        });
    });

    describe('updateFixture', () => {
        after(async () => {
            await db.Fixture.destroy({
                where: {}
            });

            await db.Team.destroy({
                where: {}
            });
        });
        
        it('should return 204 on successful update', async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            const fixture = await db.Fixture.create({ homeTeamId: team1.id, awayTeamId: team2.id, homeTeamScore: 0, awayTeamScore: 1, matchDate: new Date(), pending: false});

            return updateFixture({ ...req, 
                params: { id: fixture.id }, 
                body: { homeTeamScore: null, awayTeamScore: null } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(204);
                    });
        });
    });

    describe('deleteFixture', () => {
        it('should return 204 on successful delete', async () => {
            const team1 = await db.Team.create({ name: 'Uyo Meyo FC' });
            const team2 = await db.Team.create({ name: 'Lewl FC' });

            const fixture = await db.Fixture.create({ homeTeamId: team1.id, awayTeamId: team2.id, homeTeamScore: 0, awayTeamScore: 1, matchDate: new Date(), pending: false});

            return deleteFixture({ ...req, 
                params: { id: fixture.id } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(204);

                        return getFixtureById({ ...req, params: { id: fixture.id } }, res)
                            .catch(() => {
                                expect(res.statusCode).to.equal(404);
                            });
                    });
        });

        it('should return 400 on unsuccessful delete', async () => {
            return deleteFixture({ ...req, 
                params: { id: 1 } }, res)
                    .catch(() => {
                        expect(res.statusCode).to.equal(400);
                    });
        });
    });

    describe('searchFixtures', () => {
        it('should return 200 when home team name supplied', () => {

            return searchFixtures({ ...req, query: { homeTeamName: 'Uyo Meyo' }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('searchFixtures', () => {
        it('should return 200 when away team name supplied', () => {

            return searchFixtures({ ...req, query: { awayTeamName: 'Lewl' }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('searchFixtures', () => {
        it('should return 200 when completed query supplied', () => {

            return searchFixtures({ ...req, query: { completed: "true" }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('should return 200 when completed query supplied', () => {

            return searchFixtures({ ...req, query: { completed: "false" }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('should return 404 when home team name does not match teams in DB', () => {
            return searchFixtures({ ...req, query: { homeTeamName: '6516184534848' }, url: 'key' }, res)
                .catch(() => {
                    expect(res.statusCode).to.equal(404);
                });
        });

        it('should return 404 when away team name does not match teams in DB', () => {
            return searchFixtures({ ...req, query: { awayTeamName: '6516184534848' }, url: 'key' }, res)
                .catch(() => {
                    expect(res.statusCode).to.equal(404);
                });
        });
    });

    describe('searchFixtures', () => {
        it('should return 200 when before match date query supplied', () => {

            return searchFixtures({ ...req, query: { fixturesBeforeDate: new Date() }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('searchFixtures', () => {
        it('should return 200 when after match date query supplied', () => {

            return searchFixtures({ ...req, query: { fixturesAfterDate: new Date() }, url: 'key' }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });
});