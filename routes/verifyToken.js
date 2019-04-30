const jwt = require('jsonwebtoken');
const SECRET_KEY = "secretkey23456";

const verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

    if (!authHeader) {
        res.status(401).send('No bearer token sent in request');
    }
    const header = authHeader.split(' ');
    const token = header[1];

    if (token) {
        console.log(token);
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err) res.status(401).send(err.message);
            
                req.authenticated = false;
                req.decoded = null;
                res.status(401).send('Unauthorized');
            } else {
                req.authenticated = true;
                req.decoded = decoded;
            }
        });
    }
    return req;
}

module.exports = verifyToken;