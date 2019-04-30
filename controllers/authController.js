const db = require('../models');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const createUser = (user) => {
    return db.User.create(user);
}

const findUserByEmail = (email) => {
    return db.User.findOne({where: { email: email } });
}

module.exports = {
    signUp: (req, res) => {
        const { name, email }  =  req.body;
        const  password  =  bcrypt.hashSync(req.body.password);

        createUser({ name, email, password, isAdmin: false })       
        .then(user => {
            res.status(200).send({ "message": "user created succesfully" });
        })
        .catch(err => {
            if (err instanceof Sequelize.UniqueConstraintError) {
                res.status(400).send('User email already exists');
            }
            res.status(500).send('Error creating user.')
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;

        findUserByEmail(email)
        .then(user => {
            bcrypt.compare(password, user.password, (err, valid) => {
                if (err) res.status(500).send('Error validating password.');

                if (valid == false) {
                    res.status(401).send('Password not valid!');
                }
            });
            
            const expiresIn  =  24 * 60 * 60;
            const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }, SECRET_KEY, {
                expiresIn:  expiresIn
            });

            res.status(200)
            .send({ 
                "user": { "id": user.id, "name": user.name, "email": user.email }, 
                "access_token": accessToken, 
                "expires_in": expiresIn 
            });
        })
        .catch(err => res.status(404).send('User not found'));
    }
}