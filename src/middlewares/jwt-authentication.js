'use strict';
const jwt = require('jsonwebtoken');

async function jwtAuthentication(req, res, next) {
    const {headers: { authorization }} = req;
    if(authorization) {
        const token = await jwt.verify(authorization.slice(7, authorization.length), process.env.SECRET);
        Date.now() < token.exp * 1000 && (req.user = token.user);
    }
    
    next();
}

module.exports = jwtAuthentication;