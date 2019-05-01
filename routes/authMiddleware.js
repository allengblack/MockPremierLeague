const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../const');

const verifyUserAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

    if (!authHeader) {
        return res.status(401).send('No bearer token sent in request');
    }
    const header = authHeader.split(' ');
    const token = header[1];

    if (token) {
        jwt.verify(token, SECRET_KEY, function (err, decoded) {
            if (err) {
                if (err) return res.status(401).send(err.message);
            
                req.authenticated = false;
                req.decoded = null;
                return res.json(401).send('Unauthorized');
            } else {
                req.authenticated = true;
                req.decoded = decoded;
                return next();
            }
        });
    } else {
        return res.status(401).send('No bearer token sent in request');
    }
}

const verifyUserIsAdmin = (req, res, next) => {
    if (!req.decoded.isAdmin) res.status(401).send('User must be admin to access this resource.');
    next();
}

module.exports = {
    verifyUserAuthenticated,
    verifyUserIsAdmin
}