const db = require('../models');
const verifyToken = require('../routes/verifyToken');

module.exports = {
    listAllUsers: (req, res) => {
        verifyToken(req, res);
        if (!req.decoded.isAdmin) res.status(401).send('User must be admin to access this resource.');

        return db.User.findAll()
        .then((users) => res.send(users))
        .catch((err) => res.send(err));
    },
    
    getUserById: (req, res) => {
        verifyToken(req, res);
        if (!req.decoded.isAdmin || req.decoded.id != req.params.id) res.status(401).send('User must be admin to access this resource.');


        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
        .then(user => res.send(user))
        .catch(err => res.status(400).send(err));
    },

    // createUser: (req, res) => {
    //     verifyToken(req, res);

    //     const { name, email, password } = req.body;
    //     return db.User.create({ name, email, password })
    //     .then((user) => res.send(user))
    //     .catch((err) => {
    //         console.log('There was an error creating a user', JSON.stringify(user));
    //         return res.status(400).send(err);
    //     });
    // }, 

    deleteUser: (req, res) => {
        verifyToken(req, res);
        if (!req.decoded.isAdmin) res.status(401).send('User must be admin to access this resource.');

        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
        .then((user) => user.destroy())
        .then(() => res.send({ id }))
        .catch((err) => {
            res.status(400).send(err)
        });
    },

    updateUser: (req, res) => {
        verifyToken(req, res);
        const id = parseInt(req.params.id);
        if ( (req.decoded.id == id) || (req.decoded.isAdmin) ) {
            return db.User.findByPk(id)
            .then((user) => {
                const { name, isAdmin, email } = req.body;

                if (email && email != user.email) res.status(400).send('cannot change user email');

                return user.update({ name, isAdmin })
                .then(() => res.send(user));
            })
            .catch((err) => {
                res.status(400).send(err)
            });
        } 

        res.status(401).send('User not authorized to access this resource.');
    }
}