const db = require('../models');
const verifyToken = require('../routes/verifyToken');

module.exports = {
    listAllUsers: (req, res) => {
        verifyToken(req, res);

        return db.User.findAll()
        .then((users) => res.send(users))
        .catch((err) => res.send(err));
    },
    
    getUserById: (req, res) => {
        verifyToken(req, res);

        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
        .then(user => res.send(user))
        .catch(err => res.status(400).send(err));
    },

    createUser: (req, res) => {
        verifyToken(req, res);

        const { name, email, password } = req.body;
        return db.User.create({ name, email, password })
        .then((user) => res.send(user))
        .catch((err) => {
            console.log('There was an error creating a user', JSON.stringify(user));
            return res.status(400).send(err);
        });
    }, 

    deleteUser: (req, res) => {
        verifyToken(req, res);

        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
        .then((user) => user.destroy())
        .then(() => res.send({ id }))
        .catch((err) => {
            console.log('***Error deleting user', JSON.stringify(err))
            res.status(400).send(err)
        });
    },

    updateUser: (req, res) => {
        verifyToken(req, res);

        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
        .then((user) => {
            const { name, email } = req.body;
            return user.update({ name, email })
            .then(() => res.send(user));
        })
        .catch((err) => {
            console.log('Error updating User', JSON.stringify(err))
            res.status(400).send(err)
        });
    }
}