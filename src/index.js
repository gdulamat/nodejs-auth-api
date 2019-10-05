'use strict';
require('./modules/globals/globals');
const app = require('./app');
const connectDB = require('./dao/connect');
const Mailer = require('./modules/mailer/mailer');

logger("The program is starting");
Mailer.configMailer();

connectDB()
    .then(()=> {
        app.listen(process.env.PORT, () => logger(`App listen at port ${process.env.PORT}`));
    });