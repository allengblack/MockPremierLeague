const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 0, checkPeriod: 0 });
const HOST = process.env.HOST;
const PORT = process.env.PORT;

module.exports = {
    createFixture: (req, res) => {
        const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

        const pending = (homeTeamScore == null) && (awayTeamScore == null);

        return db.Fixture.create({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, pending })
            .then(fixture => {
                const key = HOST+PORT+'/api/fixtures/'+fixture.id;

                cache.flushAll();
                cache.set(key, fixture.toJSON(), (err, success) => {
                    if(success && !err) {
                        res.status(201).send(fixture);
                    } else {
                        res.status(201).send(fixture)
                        console.log('caching failed.')
                    }
                });
            })
            .catch(err => {
                if (err.name == 'SequelizeForeignKeyConstraintError') {
                    res.status(400).send('Check team Ids. Only existing teams can be added to fixtures.')
                    } else {
                        res.status(500).send('Error creating fixture ' + err.name);
                    }
            });
    },

    getAllFixtures: (req, res) => {
        const key = HOST+PORT+'/api/fixtures';
        const value = cache.get(key); 
        
        if (value !== undefined) {
            console.log('from cache: ' + key)
            res.status(200).send(value);
        } else {
            return db.Fixture.findAll({ 
                attributes: ['id', 'homeTeamId', 'awayTeamId', 'homeTeamScore', 'awayTeamScore', 'matchDate'], 
                raw: true 
            })
            .then(fixtures => {
                cache.set(key, fixtures, (err, success) => {
                    if(success) {
                        res.status(200).send(fixtures);
                    } else {
                        console.log('caching failed');
                        res.status(200).send(fixtures)
                    }
                });
            })
            .catch(err => {
                res.status(500).send(err)
            });
        }
    },

    getFixtureById: (req, res) => {
        const id = parseInt(req.params.id);
        const key = HOST+PORT+'/api/fixtures/'+id;

        const value = cache.get(key);

        if(value != undefined) {
            console.log('from cache: ' + key)
            res.send(value);
        } else {
            return db.Fixture.findByPk(id, { raw: true })
                .then(fixture => {
                    if(fixture == null) {
                        res.status(404).send('fixture not found');
                    }

                    cache.set(key, fixture, (err, success) => {
                        if(success) {
                            res.status(200).send(fixture);
                        } else {
                            console.log('caching failed');
                            res.status(200).send(fixtures)
                        }
                    });
                })
                .catch(err => {
                    res.status(500).send(err)
                });
        }
    },

    updateFixture: (req, res) => {
        const id = parseInt(req.params.id);
        const key = HOST+PORT+'/api/fixtures/'+id;
        
        return db.Fixture.findByPk(id)
            .then(fixture => {
                const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

                const pending = (homeTeamScore == null) && (awayTeamScore == null);

                return fixture.update({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, pending })
                    .then(() => {
                        cache.flushAll();
                        res.status(204).send(fixture);
                    })
                    .catch(err => res.status(500).send('Error updating fixture.'));
            })
            .catch((err) => {
                res.status(400).send(err)
            });
    },

    deleteFixture: (req, res) => {
        const id = parseInt(req.params.id);
        const key = HOST+PORT+'/api/fixtures/'+id;

        return db.Fixture.findByPk(id)
            .then(fixture => {
                if (fixture == null) res.status(404).send('fixture not found');
                cache.del(key);
                fixture.destroy();
            })
            .then(() => res.status(204).send({ id }))
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    searchFixtures: async (req, res) => {
        const key = req.url;

        const result = cache.get(key);

        if(result != undefined) {
            console.log('from cache: ' + key)
            res.send(result);
        } else {
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
                if (completed == "true") {
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
    

            return db.Fixture.findAll({ 
                ...searchParams, attributes: ['id', 'homeTeamId', 'awayTeamId', 'homeTeamScore', 'awayTeamScore', 'matchDate'],
                raw: true
            })
                .then((fixtures) => {
                    cache.set(key, fixtures, (err, success) => {
                        if(success & !err) {
                            res.status(200).send(fixtures);
                        } else {
                            console.log('caching failed');
                            res.status(200).send(fixtures);
                        }
                    });
                })
                .catch(err => {
                    res.status(500).send('And error occured ' + err);
                });
            }        
    }
}