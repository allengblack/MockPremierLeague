const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    createFixture: (req, res) => {
        const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

        const pending = (homeTeamScore) == null && awayTeamScore == null; //|| this.getDataValue('matchDate') > new Date();

        return db.Fixture.create({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, pending })
            .then(fixture => res.status(201).send(fixture))
            .catch(err => {
                if (err.name == 'SequelizeForeignKeyConstraintError') {
                    res.status(400).send('Check team Ids. Only existing teams can be added to fixtures.')
                    } else {
                        res.status(500).send('Error creating fixture ' + err.name);
                    }
            });
    },

    getAllFixtures: (req, res) => {
        return db.Fixture.findAll()
            .then(fixtures => res.send(fixtures))
            .catch(err => res.status(404).send(err));
    },

    getFixtureById: (req, res) => {
        const id = parseInt(req.params.id);

        return db.Fixture.findByPk(id)
            .then(fixture => res.send(fixture))
            .catch(err => res.status(400).send(err));
    },

    updateFixture: (req, res) => {
        const id = parseInt(req.params.id);
        
        return db.Fixture.findByPk(id)
            .then(fixture => {
                const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

                const pending = (homeTeamScore) == null && awayTeamScore == null; //|| this.getDataValue('matchDate') > new Date();

                return fixture.update({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, pending })
                    .then(() => res.send(fixture))
                    .catch(err => res.status(500).send('Error updating fixture.'));
            })
            .catch((err) => {
                res.status(400).send(err)
            });
    },

    deleteFixture: (req, res) => {
        const id = parseInt(req.params.id);

        return db.Fixture.findByPk(id)
            .then(fixture => fixture.destroy())
            .then(() => res.send({ id }))
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    searchFixtures: async (req, res) => {
        let searchParams = { where : {} };
        searchParams.where.matchDate = {};

        const homeTeamName = req.query['homeTeamName'];
        const awayTeamName = req.query['awayTeamName'];
        const teamName = req.query['teamName'];
        const completed = req.query['completed'];
        const fixturesBeforeDate = req.query['fixturesBeforeDate'];
        const fixturesAfterDate = req.query['fixturesAfterDate'];

        if(homeTeamName !== undefined) {
            let team = await db.Team.findOne({ 
                where: { 
                    name: {
                        [Op.substring]: homeTeamName
                    }
                }
            });

            searchParams.where.homeTeamId = team.id;
        }

        if(awayTeamName !== undefined) {
            let team = await db.Team.findOne({ 
                where: { 
                    name: {
                        [Op.substring]: awayTeamName
                    }
                }
            });

            searchParams.where.awayTeamId = team.id;
        }

        if(completed !== undefined) {
            searchParams.where.pending = {
                [Op.eq] : !completed
            };
        }

        if (fixturesAfterDate !== undefined) {
            searchParams.where.matchDate[Op.gte] = fixturesAfterDate;
        }

        if (fixturesBeforeDate !== undefined) {
            searchParams.where.matchDate[Op.lte] = fixturesBeforeDate;
        }

        try {
            const fixtures = await db.Fixture.findAll(searchParams);
            res.send(fixtures);
        } catch (error) {
            res.status(500).send('And error occured ' + error);
        } 
    }
}

const getFixtures = async (req, res, whereConditions) => {
    try {
        const fixtures = await db.Fixture.findAll({ where: whereConditions });
        res.send(fixtures);
    } catch (error) {
        res.status(500).send('And error occured ' + error);
    } 
}