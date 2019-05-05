const express = require('express');
const Joi = require('joi')
const validator = require('express-joi-validation')({})
const routes = express.Router();
const authMiddleware = require('./authMiddleware');

const auth = require('../controllers/authController');
const users = require('../controllers/usersController');
const teams = require('../controllers/teamsController');
const fixtures = require('../controllers/fixturesControllers');

//auth
routes.post('/signup', validator.body(
    Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    {}), 
    auth.signUp);

routes.post('/login', validator.body(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }), 
    {}), auth.login);

routes.use(authMiddleware.verifyUserAuthenticated);

routes.get('/api/fixtures', fixtures.getAllFixtures);
routes.get('/api/fixtures/:id', fixtures.getFixtureById);

routes.get('/api/search/fixtures', fixtures.searchFixtures);
routes.get('/api/teams', teams.getAllTeams);

routes.use(authMiddleware.verifyUserIsAdmin);

//users
routes.get('/api/users', users.getAllUsers);
routes.get('/api/users/:id', users.getUserById);
routes.put('/api/users/:id', users.updateUser);
routes.delete('/api/users/:id', users.deleteUser);

//teams
routes.get('/api/teams/:id', teams.getTeamById);
routes.post('/api/teams', teams.createTeam);
routes.put('/api/teams/:id', teams.updateTeam);
routes.delete('/api/teams/:id', teams.deleteTeam);

//fixtures
routes.post('/api/fixtures', fixtures.createFixture);
routes.put('/api/fixtures/:id', fixtures.updateFixture);
routes.delete('/api/fixtures/:id', fixtures.deleteFixture);

module.exports = routes;