const express = require('express');  
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./models');
const Sequelize = require('sequelize');

const PORT = +process.env.PORT || 3000;
const SECRET_KEY = "secretkey23456";

const app = express();

app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { name, email }  =  req.body;
    const  password  =  bcrypt.hashSync(req.body.password);

    createUser({name, email, password})       
        .then(user => {
            res.status(200).send({ "message": "user created succesfully" });
        })
        .catch(err => {
            if (err instanceof Sequelize.UniqueConstraintError) {
                res.status(400).send('User email already exists');
            }
            res.status(500).send('Error creating user.')
        });
});

app.post('/login', (req, res) => {
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
            const accessToken = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, {
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
});

app.use('/', routes);

app.listen(PORT, () => {  
  console.log('Server is running on port ' + PORT);
});

const createUser = (user) => {
    return db.User.create(user);
}

const findUserByEmail = (email) => {
    return db.User.findOne({where: { email: email } });
}