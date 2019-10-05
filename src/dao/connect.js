'use strict';
const MongoClient = require('mongodb').MongoClient;
const UserDAO = require('./users-dao');
const RegistrationsDAO = require('./registrations-dao');

async function connect() {
    try {
        const dbConn = await MongoClient.connect(process.env.CONN_STRING, {
            //connection settings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await UserDAO.getCollections(dbConn);
        await RegistrationsDAO.getCollections(dbConn);
        logger("DB connected successfuly");
    } catch(e) {
        await logger(`Error on DB connection: ${e}`);
        process.exit(1);
    }
}

module.exports = connect;