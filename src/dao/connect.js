'use strict';
const MongoClient = require('mongodb').MongoClient;
const UserDAO = require('./users-dao');
const RegistrationsDAO = require('./registrations-dao');

/**
 * 
 * @param {String} dbConnString 
 * @param {String} dbName 
 */
async function connectDB(dbConnString, dbName) {
    try {
        const dbConn = await MongoClient.connect(dbConnString, {
            //connection settings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await UserDAO.getCollections(dbConn, dbName);
        await RegistrationsDAO.getCollections(dbConn, dbName);
        logger("DB connected successfuly");
        return;
    } catch(e) {
        await logger(`Error on DB connection: ${e}`);
        process.exit(1);
    }
}

module.exports = connectDB;