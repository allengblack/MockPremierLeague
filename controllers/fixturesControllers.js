const db = require('../models');

module.exports = {
    createFixture: (req, res) => {
        const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

        return db.Fixture.create({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate })
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

                return fixture.update({ homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate })
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
    }
}