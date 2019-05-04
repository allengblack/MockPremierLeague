const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    createFixture: (req, res) => {
        const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

        const pending = (homeTeamScore == null) && (awayTeamScore == null); //|| this.getDataValue('matchDate') > new Date();

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
            .then(fixtures => res.status(200).send(fixtures))
            .catch(err => res.status(500).send(err));
    },

    getFixtureById: (req, res) => {
        const id = parseInt(req.params.id);

        return db.Fixture.findByPk(id)
            .then(fixture => res.send(fixture))
            .catch(err => {
                res.status(404).send(err)
            });
    },

    updateFixture: (req, res) => {
        const id = parseInt(req.params.id);
        
        return db.Fixture.findByPk(id)
            .then(fixture => {
                const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

                const pending = (homeTeamScore == null) && (awayTeamScore == null); //|| this.getDataValue('matchDate') > new Date();

                return fixture.update({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, pending })
                    .then(() => res.status(204).send(fixture))
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
            .then(() => res.status(204).send({ id }))
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    searchFixtures: async (req, res) => {
        let searchParams = { where : {} };

        const homeTeamName = req.query['homeTeamName'];
        const awayTeamName = req.query['awayTeamName'];
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
            if (!searchParams.where.matchDate) {
                searchParams.where.matchDate = {};
            }
            searchParams.where.matchDate[Op.gte] = fixturesAfterDate;
        }

        if (fixturesBeforeDate !== undefined) {
            if (!searchParams.where.matchDate) {
                searchParams.where.matchDate = {};
            }
            searchParams.where.matchDate[Op.lte] = fixturesBeforeDate;
        }

        return db.Fixture.findAll(searchParams)
            .then((fixtures) => {
                return res.status(200).send(fixtures);
            })
            .catch(err => {
                res.status(500).send('And error occured ' + err);
            });
        
        // try {
        //     console.log({ searchParams })
        //     const fixtures = await db.Fixture.findAll(searchParams);
        //     return res.send(fixtures);
        // } catch (error) {
        //     return res.status(500).send('And error occured ' + error);
        // } 
    }
}