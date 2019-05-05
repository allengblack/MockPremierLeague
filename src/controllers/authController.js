const db = require('../models');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY;
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

        return createUser({ name, email, password, isAdmin: false })       
            .then(user => {
                res.status(201).send({ "message": "user created succesfully" });
            })
            .catch(err => {
                if (err instanceof Sequelize.UniqueConstraintError) {
                    res.status(400).send('User email already exists');
                }
                res.status(500).send(err);
            });
    },

    login: (req, res) => {
        const { email, password } = req.body;

        return findUserByEmail(email)
            .then(user => {
                return bcrypt.compare(password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(400).send('invalid username or password');
                        }
                        else {
                            const expiresIn  =  24 * 60 * 60;
                            const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }, 
                                SECRET_KEY, {
                                expiresIn:  expiresIn
                            });
            
                            return res.status(200)
                                .send({ 
                                    "user": { 
                                        "id": user.id, 
                                        "name": user.name, 
                                        "email": user.email 
                                    }, 
                                    "access_token": accessToken, 
                                    "expires_in": expiresIn 
                                });
                        }
                    })
                    .catch(err => {
                        res.status(500).send('error creating user')
                    })
               
            })
            .catch(err => {
                res.status(404).send('user not found')
            });
    }
}