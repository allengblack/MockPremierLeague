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
        return db.Fixture.findAll({ attributes: ['id', 'homeTeamId', 'awayTeamId', 'homeTeamScore', 'awayTeamScore', 'matchDate'] })
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
            try {
                let team = await db.Team.findOne({ 
                    where: { 
                        name: {
                            [Op.substring]: homeTeamName
                        }
                    }
                });

                searchParams.where.homeTeamId = team.id;
            } catch (error) {
                res.status(404).send('Home team name provided does not match any team in league')
            }
        }

        if(awayTeamName !== undefined) {
            try {
                let team = await db.Team.findOne({ 
                    where: { 
                        name: {
                            [Op.substring]: awayTeamName
                        }
                    }
                });
                
                searchParams.where.awayTeamId = team.id;
            } catch (error) {
                res.status(404).send('Away team name provided does not match any team in league')
            }
        }

        if(completed !== undefined) {
            var value = undefined;
            if (completed === "true") {
                value = true;
            } else {
                value = false;
            }
            searchParams.where.pending = {
                [Op.eq] : !value
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

        return db.Fixture.findAll({ ...searchParams, attributes: ['id', 'homeTeamId', 'awayTeamId', 'homeTeamScore', 'awayTeamScore', 'matchDate'] })
            .then((fixtures) => {
                return res.status(200).send(fixtures);
            })
            .catch(err => {
                res.status(500).send('And error occured ' + err);
            });
    }
}