process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam } = require('../../src/controllers/teamsController');
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

describe('Teams Controller Unit tests', () => {
    describe('createTeam', () => {
        after(async () => {
            await db.Team.destroy({
                where: {}
            });
        });

        it('should return 201 on successful team creation', () => {
            return createTeam({ ...req, body: { name: 'Shashe FC' }}, res)
                .then(() => {
                    expect(res.statusCode).to.equal(201);
                });
        });
    });

    describe('getAllTeams', () => {
        after(async () => {
            await db.Team.destroy({
                where: {}
            });
        });

        it('should return 200 on successful team retrieval', () => {
            return getAllTeams(req, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });
    });

    describe('getTeamById', () => {
        after(async () => {
            await db.Team.destroy({
                where: {}
            });
        });

        it('it should return 200 if team recovery successful', async () => {
            const team = await db.Team.create({ name: 'Uyo Meyo FC' });

            return getTeamById({ ...req, params: { id: team.id } }, res)
                .then(() => {
                    expect(res.statusCode).to.equal(200);
                });
        });

        it('it should return 404 if team recovery unsuccessful', async () => {
            return getTeamById({ ...req, params: { id: 10023 } }, res)
                .catch(err => {
                    expect(res.statusCode).to.equal(404);
                });
        });
    });

    describe('updateTeam', () => {
        after(async () => {
            await db.Team.destroy({
                where: {}
            });
        });

        it('should return 204 on successful team update', async () => {
            const team = await db.Team.create({ name: 'FIFA19 FC' });

            return updateTeam({ ...req, 
                params: { id: team.id }, 
                body: { name: 'Yahoo FC' } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(204);
                    });
        });

        it('should return 400 on unsuccessful team update', async () => {
            const team = await db.Team.create({ name: 'FIFA19 FC' });

            return updateTeam({ ...req, 
                params: { id: 12335432 }, 
                body: { name: 'Yahoo FC' } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(400);
                    });
        });
    });

    describe('deleteTeam', () => {
        after(async () => {
            await db.Team.destroy({
                where: {}
            });
        });

        it('should return 204 on successful team delete', async () => {
            const team = await db.Team.create({ name: 'Uyo Meyo FC' });

            return deleteTeam({ ...req, 
                params: { id: team.id } }, res)
                    .then(() => {
                        expect(res.statusCode).to.equal(204);

                        return getTeamById({ ...req, params: { id: team.id } }, res)
                            .catch(() => {
                                expect(res.statusCode).to.equal(400);
                            });
                    });
        });

        it('should return 400 on unsuccessful team delete', async () => {
            return deleteTeam({ ...req, 
                params: { id: 56453 } }, res)
                    .catch(() => {
                        expect(res.statusCode).to.equal(400);
                    });
        });
    });
});