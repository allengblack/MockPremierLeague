var express = require('express');
var routes = express.Router();
var users = require('../controllers/usersController');

//users
routes.get('/api/users', users.listAllUsers);
routes.get('/api/users/:id', users.getUserById);
routes.post('/api/users', users.createUser);
routes.put('/api/users/:id', users.updateUser);
routes.delete('/api/users/:id', users.deleteUser);

module.exports = routes;