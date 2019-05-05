const db = require('../models');

module.exports = {
    getAllUsers: (req, res) => {
        return db.User.findAll({
            attributes: ['id', 'name', 'email']
        })
            .then((users) => {
                res.status(200).send(users)
            })
            .catch((err) => { 
                res.status(400).send(err)
            });
    },
    
    getUserById: (req, res) => {
        const id = parseInt(req.params.id);

        return db.User.findByPk(id, {attributes: ['id', 'name', 'email']})
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(404).send(err)
            });
    },

    deleteUser: (req, res) => {
        const id = parseInt(req.params.id);
        return db.User.findByPk(id)
            .then((user) => user.destroy())
            .then(() => {
                res.status(204).send({ id })
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    updateUser: (req, res) => {
        const id = parseInt(req.params.id);
        
        if ( (req.decoded.id === id) || (req.decoded.isAdmin) ) {
            return db.User.findByPk(id)
            .then((user) => {
                const { name, isAdmin } = req.body;

                return user.update({ name, isAdmin })
                    .then(() => {
                        res.status(204).send(user);
                    })
                    .catch(err => {
                        res.status(500).send('Error updating user.')
                    });
            })
            .catch((err) => {
                res.status(400).send(err)
            });
        } else{
            return new Promise((resolve, reject) => {
                reject(res.status(401).send('User not authorized to access this resource.'));
            });   
        }
    }
}