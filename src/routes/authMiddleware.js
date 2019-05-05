const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

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
        jwt.verify(token, SECRET_KEY, function (err, decoded) {
            if (err) {
                req.authenticated = false;
                req.decoded = null;

                res.status(401).send({err});
            } else {
                req.authenticated = true;
                req.decoded = decoded;
                console.log({token, SECRET_KEY})

                next();
            }
        });
    } else {
        res.status(401).send('No bearer token sent in request.');
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