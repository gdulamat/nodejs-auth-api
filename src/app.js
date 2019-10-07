'use strict';
const express = require('express');
const sanitizer = require('./middlewares/sanitizer');
const jwtAuthentication = require('./middlewares/jwt-authentication');
const usersRouter = require('./api/routes/users.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizer);
app.use(jwtAuthentication)

app.use('/api/v1/users', usersRouter);

module.exports = app;