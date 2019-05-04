const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../../const');

const verifyUserAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

    if (!authHeader) {
        return new Promise((resolve, reject) => {
            reject(res.status(401).send('No bearer token sent in request.'));
        }); 
    }
    const header = authHeader.split(' ');
    const token = header[1];

    if (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, function (err, decoded) {
                if (err) {
                    req.authenticated = false;
                    req.decoded = null;
    
                    reject(res.status(401).send('unauthorized'));
                } else {
                    req.authenticated = true;
                    req.decoded = decoded;
    
                    resolve(next);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            reject(res.status(401).send('No bearer token sent in request.'));
        });
    }
}

const verifyUserIsAdmin = (req, res, next) => {
    if (!req.decoded.isAdmin) {
        res.status(401).send('User must be admin to access this resource.');
    } else {
        next();
    }
}

module.exports = {
    verifyUserAuthenticated,
    verifyUserIsAdmin
}