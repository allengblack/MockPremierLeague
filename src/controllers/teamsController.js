const db = require('../models');

module.exports = {
    createTeam: (req, res) => {
        const { name } = req.body;

        return db.Team.create({ name })
            .then(team => res.status(201).send(team))
            .catch(err => res.status(500).send('Error creating team' + err.name));
    },

    getAllTeams: (req, res) => {
        return db.Team.findAll()
            .then(teams => res.status(200).send(teams))
            .catch(err => res.status(500).send(err));
    },

    getTeamById: (req, res) => {
        const id = parseInt(req.params.id);
        
        return db.Team.findByPk(id)
            .then(team => {
                if (team == null) res.status(404).send('team not found');
                res.status(200).send(team)
            })
            .catch(err => {
                res.status(404).send(err)
            });
    },

    updateTeam: (req, res) => {
        const id = parseInt(req.params.id);
        return db.Team.findByPk(id)
            .then(team => {
                if (team == null) res.status(404).send('team not found');
                const { name } = req.body;

                return team.update({ name })
                    .then(() => res.status(204).send(team))
                    .catch(err => res.status(500).send('Error updating team.'));
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    deleteTeam: (req, res) => {
        const id = parseInt(req.params.id);
        return db.Team.findByPk(id)
            .then(team => {
                if (team == null) res.status(404).send('team not found');
                team.destroy()
            })
            .then(() => {
                res.status(204).send({ id });
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    },
}