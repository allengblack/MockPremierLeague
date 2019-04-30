const express = require('express');  
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./models');

const PORT = +process.env.PORT || 3000;
const SECRET_KEY = "secretkey23456";

const app = express();

app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const  name  =  req.body.name;
    const  email  =  req.body.email;
    const  password  =  bcrypt.hashSync(req.body.password);

    createUser({name, email, password})       
        .then(user => {
            const expiresIn  =  24 * 60 * 60;

            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });

            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        })
        .catch(err => res.status(500).send('Server error!'));
});

// app.use('/', routes);

app.listen(PORT, () => {  
  console.log('Server is running on port ' + PORT);
});

const createUser = (user) => {
    return db.User.create(user);
}

const findUserByEmail = (email) => {
    return db.User.findOne({where: { email: email } });
}