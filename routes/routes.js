const auth = require('../controllers/authController');
const express = require('express');
const routes = express.Router();
const users = require('../controllers/usersController');
const verifyToken = require('./verifyToken');

//auth
routes.post('/signup', auth.signUp);
routes.post('/login', auth.login);

routes.use(verifyToken);

//users
routes.get('/api/users', users.listAllUsers);
routes.get('/api/users/:id', users.getUserById);
routes.put('/api/users/:id', users.updateUser);
routes.delete('/api/users/:id', users.deleteUser);
// routes.post('/api/users', users.createUser);

module.exports = routes;